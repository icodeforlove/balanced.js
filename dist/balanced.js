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
	function escapeRegExp(str) {
	  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	function matchContentsInBetweenBrackets(string, head, right, left) {
		var caseInsensitive = head instanceof RegExp && head.ignoreCase,
			headRegExp = head instanceof RegExp ? head : new RegExp(escapeRegExp(head)),
			rightRegExp = right instanceof RegExp ? right : new RegExp(escapeRegExp(right)),
			leftRegExp = left instanceof RegExp ? left : new RegExp(escapeRegExp(left)),
			regex = new RegExp(
				headRegExp.source + '|' + 
				rightRegExp.source + '|' + 
				leftRegExp.source,
				'g' + (caseInsensitive ? 'i' : '')
			),
			matches = [],
			matchedOpening = null,
			depth,
			match;
	 
		while ((match = regex.exec(string))) {
			if (!matchedOpening && match[0].match(headRegExp)) {
				matchedOpening = match;
				depth = 1;
			} else if (match[0].match(rightRegExp)) {
				depth++;
			} else if (match[0].match(leftRegExp)) {
				depth--;
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
	 
		return matches;
	}
	 
	function replaceMatchesInString(matches, string, replace) {
		var offset = 0;
		
		for (var i = 0; i < matches.length; i++) {
			var match = matches[i],
				replacement = replace(string.substr(match.index + offset + match.head.length, match.length - match.head.length), match.head, match.tail);
			string = string.substr(0, match.index + offset) + replacement + string.substr(match.index + offset + match.length + 1, (string.length) - (match.index + offset + match.length));
			
			offset += replacement.length - match.length - 1;
		}
		
		return string;
	}
	 
	function replaceMatchesInBetweenBrackets(string, start, right, left, replace) {
		var matches = matchContentsInBetweenBrackets(string, start, right, left);
		return replaceMatchesInString(matches, string, replace);
	}

	exports.replaceMatchesInString = replaceMatchesInString; 

	exports.replacements = function (config) {
		config = config || {};
		config.head = config.head || config.right;

		if (!config.source) throw new Error('Balanced: please provide a "source" property');
		if (!config.right) throw new Error('Balanced: please provide a "right" property');
		if (!config.left) throw new Error('Balanced: please provide a "left" property');
		if (typeof config.replace !==  'function') throw new Error('Balanced: please provide a "replace" function');

		return replaceMatchesInBetweenBrackets(config.source, config.head, config.right, config.left, config.replace);
	};

	exports.matches = function (config) {
		config = config || {};
		config.head = config.head || config.right;

		if (!config.source) throw new Error('Balanced: please provide a "source" property');
		if (!config.right) throw new Error('Balanced: please provide a "right" property');
		if (!config.left) throw new Error('Balanced: please provide a "left" property');
		
		return matchContentsInBetweenBrackets(config.source, config.head, config.right, config.left);
	};

/***/ }
/******/ ])