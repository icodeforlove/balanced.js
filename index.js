// Note: this currently doesn't support nested replacements because its meant to be 
// greedy and grab the first opening all the way to the last
function matchContentsInBetweenBrackets(string, start, right, left) {
	var caseInsensitive = start instanceof RegExp && start.ignoreCase,
		regex = new RegExp(
			(start instanceof RegExp ? start.source : start) + '|' + 
			(right instanceof RegExp ? right.source : right) + '|' + 
			(left instanceof RegExp ? left.source : left),
			'g' + (caseInsensitive ? 'i' : '')
		),
		matches = [],
		opening = null,
		depth,
		match;
 
	while ((match = regex.exec(string))) {
		if (!opening && match[0].match(start)) {
			opening = match;
			depth = 1;
		} else if (match[0].match(right)) {
			depth++;
		} else if (match[0].match(left)) {
			depth--;
		}
 
		if (opening !== null && depth === 0) {
			matches.push({
				index: opening.index, 
				length: match.index - opening.index,
				opening: opening[0],
				closing: match[0]
			});
			opening = null;
		}
	}
 
	return matches;
}
 
function replaceMatchesInString(matches, string, replace) {
	var offset = 0;
	
	for (var i = 0; i < matches.length; i++) {
		var match = matches[i],
			replacement = replace(string.substr(match.index + offset + match.opening.length, match.length - match.opening.length), match.opening, match.closing);
		string = string.substr(0, match.index + offset) + replacement + string.substr(match.index + offset + match.length + 1, (string.length) - (match.index + offset + match.length));
		
		offset += replacement.length - match.length - 1;
	}
	
	return string;
}
 
function replaceMatchesInBetweenBrackets(string, start, right, left, replace) {
	var matches = matchContentsInBetweenBrackets(string, start, right, left);
	return replaceMatchesInString(matches, string, replace);
}

exports.replacements = function (config) {
	config = config || {};

	if (!config.source) throw new Error('BalancedReplacer: please provide a "source" property');
	if (!config.start) throw new Error('BalancedReplacer: please provide a "start" property');
	if (!config.right) throw new Error('BalancedReplacer: please provide a "right" property');
	if (!config.left) throw new Error('BalancedReplacer: please provide a "left" property');
	if (typeof config.replace !==  'function') throw new Error('BalancedReplacer: please provide a "replace" function');

	return replaceMatchesInBetweenBrackets(config.source, config.start, config.right, config.left, config.replace);
};

exports.matches = function (config) {
	config = config || {};

	if (!config.source) throw new Error('BalancedReplacer: please provide a "source" property');
	if (!config.start) throw new Error('BalancedReplacer: please provide a "start" property');
	if (!config.right) throw new Error('BalancedReplacer: please provide a "right" property');
	if (!config.left) throw new Error('BalancedReplacer: please provide a "left" property');
	
	return matchContentsInBetweenBrackets(config.source, config.start, config.right, config.left);
};