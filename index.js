// Note: this currently doesn't support nested replacements because its meant to be 
// greedy and grab the first head all the way to the last
function Balanced (config) {
	config = config || {};
	
	if (!config.open) throw new Error('Balanced: please provide a "open" property');
	if (!config.close) throw new Error('Balanced: please provide a "close" property');

	this.head = config.head || config.open;
	this.balance = config.balance || false;
	this.exceptions = config.exceptions || false;
	this.close = config.close;
	this.open = config.open;
	this.caseInsensitive = config.caseInsensitive;
}

Balanced.prototype = {
	/**
	 * Escapes a string to be used within a RegExp
	 * @param  {String} string
	 * @return {String}
	 */
	escapeRegExp: function (string) {
	  return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	},

	/**
	 * creates an RegExp from an array of string or RegExp
	 * 
	 * @param  {Array} array
	 * @param  {String} flags
	 * @param  {Boolean} grouped
	 * @return {RegExp}
	 */
	regExpFromArray: function (array, flags, grouped) {
		var string = array.map(function (value) {
			return value instanceof RegExp ? value.source : this.escapeRegExp(value);
		}, this).join('|');

		if (grouped) {
			string = '(' + string + ')';
		} else {
			string = '(?:' + string + ')';
		}

		return new RegExp(string, flags || undefined);
	},

	/**
	 * helper creating method for running regExpFromArray with one arg and grouped set to true
	 * 
	 * @param  {RegExp/String} value
	 * @return {RegExp}
	 */
	regExpFromArrayGroupedMap: function (value) {
		return this.regExpFromArray([value], null, true);
	},

	/**
	 * Matches contents
	 * 
	 * @param  {String} string
	 * @return {String}
	 */
	matchContentsInBetweenBrackets: function (string, ignoreRanges) {
		var head = Array.isArray(this.head) ? this.head : [this.head],
			open = Array.isArray(this.open) ? this.open : [this.open],
			close = Array.isArray(this.close) ? this.close : [this.close];

		if (
			!Array.isArray(head) || 
			!Array.isArray(open) || 
			!Array.isArray(close) ||
			!(head.length === open.length && open.length === close.length)
		) {
			throw new Error('Balanced: if you use arrays for a "head,open,close" you must use matching arrays for all options');
		}

		// generates a gnarly regexp
		var headRegExp = this.regExpFromArray(head.map(this.regExpFromArrayGroupedMap, this)),
			openRegExp = this.regExpFromArray(open.map(this.regExpFromArrayGroupedMap, this)),
			closeRegExp = this.regExpFromArray(close.map(this.regExpFromArrayGroupedMap, this)),
			regex = this.regExpFromArray([headRegExp, openRegExp, closeRegExp], 'g' + (this.caseInsensitive ? 'i' : '')),
			matchSetLength = head.length,
			stack = [],
			matches = [],
			matchedOpening = null,
			match,
			balanced = true;

		while ((match = regex.exec(string))) {
			if (ignoreRanges) {
				var ignore = false;
				
				for (var i = 0; i < ignoreRanges.length; i++) {
					if (match.index >= ignoreRanges[i].index && match.index <= ignoreRanges[i].index + ignoreRanges[i].length) {
						ignore = true;
						continue;
					}
				}

				if (ignore) {
					continue;
				}
			}

			var matchResultPosition = match.indexOf(match[0], 1) - 1,
				sectionIndex = Math.floor(matchResultPosition / matchSetLength),
				valueIndex = matchResultPosition - (Math.floor(matchResultPosition / matchSetLength) * matchSetLength);

			if (!matchedOpening && sectionIndex === 0 && (!this.balance || this.balance && !stack.length)) {
				matchedOpening = match;

				if (this.balance) {
					stack.push(valueIndex);
				} else {
					stack = [valueIndex];
				}
			} else if (sectionIndex === 1 || sectionIndex === 0) {
				stack.push(valueIndex);
			} else if (sectionIndex === 2) {
				var expectedValueIndex = stack.pop();

				if (expectedValueIndex === valueIndex) {
					if (matchedOpening !== null && stack.length === 0) {
						matches.push({
							index: matchedOpening.index, 
							length: match.index + match[0].length - matchedOpening.index,
							head: matchedOpening[0],
							tail: match[0]
						});
						matchedOpening = null;
					}
				} else if (this.balance) {
					balanced = false;

					if (this.exceptions) {
						if (expectedValueIndex === undefined) {
							throw new Error ('Balanced: unexpected close bracket at ' + match.index);
						} else if (expectedValueIndex !== valueIndex) {
							throw new Error ('Balanced: mismatching close bracket at ' + match.index + ' expected "' + close[expectedValueIndex] + '" but found "' + close[valueIndex] + '"');
						}
					}
				}
			}
		}

		if (this.balance) {
			if (this.exceptions && !(balanced && stack.length === 0)) {
				throw new Error ('Balanced: expected close bracket at ' + (string.length -1));
			}
			return balanced && stack.length === 0 ? matches : null;
		} else {
			return matches;
		}
	},

	/**
	 * Non-destructive match replacements.
	 * 
	 * @param  {Array} matches
	 * @param  {String} string
	 * @param  {Function} replace
	 * @return {String}
	 */
	replaceMatchesInString: function (matches, string, replace) {
		var offset = 0;
		
		for (var i = 0; i < matches.length; i++) {
			var match = matches[i],
				replacement = replace(string.substr(match.index + offset + match.head.length, match.length - match.head.length - match.tail.length), match.head, match.tail);
			string = string.substr(0, match.index + offset) + replacement + string.substr(match.index + offset + match.length, (string.length) - (match.index + offset + match.length));
			
			offset += replacement.length - match.length;
		}
		
		return string;
	},

	/**
	 * Runs replace function against matches, and source.
	 * 
	 * @param  {String} string
	 * @param  {Function} replace
	 * @param  {Array} ignoreRanges
	 * @return {String}
	 */
	replaceMatchesInBetweenBrackets: function (string, replace, ignoreRanges) {
		var matches = this.matchContentsInBetweenBrackets(string, ignoreRanges);
		return this.replaceMatchesInString(matches, string, replace);
	}
};

exports.replaceMatchesInString = Balanced.prototype.replaceMatchesInString; 

exports.replacements = function (config) {
	config = config || {};

	var balanced = new Balanced({
		head: config.head,
		open: config.open,
		close: config.close,
		balance: config.balance,
		exceptions: config.exceptions,
		caseInsensitive: config.caseInsensitive
	});

	if (!config.source) throw new Error('Balanced: please provide a "source" property');
	if (typeof config.replace !==  'function') throw new Error('Balanced: please provide a "replace" function');

	return balanced.replaceMatchesInBetweenBrackets(config.source, config.replace);
};
exports.getRangesForMatch = function (string, regexp) {
	var pattern = new RegExp(regexp),
	    match,
	    matches = [];

	while ((match = pattern.exec(string))) {
		matches.push({length: match[0].length, index: match.index});
	}

	return matches;
};
exports.matches = function (config) {
	var balanced = new Balanced({
		head: config.head,
		open: config.open,
		close: config.close,
		balance: config.balance,
		exceptions: config.exceptions,
		caseInsensitive: config.caseInsensitive
	});

	if (!config.source) throw new Error('Balanced: please provide a "source" property');

	return balanced.matchContentsInBetweenBrackets(config.source, config.ignore);
};