/**
 * balanced.js v0.0.5
 */
var balanced =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// Note: this currently doesn't support nested replacements because its meant to be 
	// greedy and grab the first head all the way to the last
	function Balanced (config) {
		config = config || {};
		
		if (!config.right) throw new Error('Balanced: please provide a "right" property');
		if (!config.left) throw new Error('Balanced: please provide a "left" property');
	
		this.head = config.head || config.right;
		this.balance = config.balance || false;
		this.exceptions = config.exceptions || false;
		this.left = config.left;
		this.right = config.right;
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
		 * Matches contents
		 * 
		 * @param  {String} string
		 * @return {String}
		 */
		matchContentsInBetweenBrackets: function (string) {
			var caseInsensitive = this.head instanceof RegExp && this.head.ignoreCase,
				headRegExp = this.head instanceof RegExp ? this.head : new RegExp(this.escapeRegExp(this.head)),
				rightRegExp = this.right instanceof RegExp ? this.right : new RegExp(this.escapeRegExp(this.right)),
				leftRegExp = this.left instanceof RegExp ? this.left : new RegExp(this.escapeRegExp(this.left)),
				regex = new RegExp(
					headRegExp.source + '|' + 
					rightRegExp.source + '|' + 
					leftRegExp.source,
					'g' + (caseInsensitive ? 'i' : '')
				),
				matches = [],
				matchedOpening = null,
				depth = 0,
				match,
				balanced = true;
	
			while ((match = regex.exec(string))) {
				if (!matchedOpening && match[0].match(headRegExp) && (!this.balance || this.balance && !depth)) {
					matchedOpening = match;
					depth = this.balance ? depth + 1 : 1;
				} else if (match[0].match(rightRegExp)) {
					depth++;
				} else if (match[0].match(leftRegExp)) {
					depth--;
				}
	
				if (this.balance && depth < 0) {
		            balanced = false;
		            if (this.exceptions) {
		            	throw new Error ('Balanced: expected right bracket at ' + match.index);
		            }
		            break;
		        }
		 
				if (matchedOpening !== null && depth === 0) {
					matches.push({
						index: matchedOpening.index, 
						length: match.index - matchedOpening.index,
						head: matchedOpening[0],
						tail: match[0]
					});
					matchedOpening = null;
				}
			}
			if (this.balance) {
				if (this.exceptions && !(balanced && depth === 0)) {
					throw new Error ('Balanced: expected left bracket at ' + (string.length -1));
				}
				return balanced && depth === 0 ? matches : null;
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
					replacement = replace(string.substr(match.index + offset + match.head.length, match.length - match.head.length), match.head, match.tail);
				string = string.substr(0, match.index + offset) + replacement + string.substr(match.index + offset + match.length + match.tail.length, (string.length) - (match.index + offset + match.length));
				
				offset += replacement.length - match.length - match.tail.length;
			}
			
			return string;
		},
	
		/**
		 * Runs replace function against matches, and source.
		 * 
		 * @param  {String} string
		 * @param  {Function} replace
		 * @return {String}
		 */
		replaceMatchesInBetweenBrackets: function (string, replace) {
			var matches = this.matchContentsInBetweenBrackets(string);
			return this.replaceMatchesInString(matches, string, replace);
		}
	};
	
	exports.replaceMatchesInString = Balanced.prototype.replaceMatchesInString; 
	
	exports.replacements = function (config) {
		config = config || {};
	
		var balanced = new Balanced({
			head: config.head,
			right: config.right,
			left: config.left,
			balance: config.balance,
			exceptions: config.exceptions
		});
	
		if (!config.source) throw new Error('Balanced: please provide a "source" property');
		if (typeof config.replace !==  'function') throw new Error('Balanced: please provide a "replace" function');
	
		return balanced.replaceMatchesInBetweenBrackets(config.source, config.replace);
	};
	
	exports.matches = function (config) {
		var balanced = new Balanced({
			head: config.head,
			right: config.right,
			left: config.left,
			balance: config.balance,
			exceptions: config.exceptions
		});
	
		if (!config.source) throw new Error('Balanced: please provide a "source" property');
	
		return balanced.matchContentsInBetweenBrackets(config.source);
	};

/***/ }
/******/ ])
//# sourceMappingURL=balanced.js.map