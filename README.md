# Balanced [![Build Status](https://travis-ci.org/icodeforlove/node-balanced.png?branch=master)](https://travis-ci.org/icodeforlove/node-balanced)

balanced string matching, and replacing.

# install

```
	npm install node-balanced
```

## example time

lets say you have

```css
{
	@hello 1 {
		a {
		}
	}
	@hello 2 {
		a {
		}
	}
	@hello 3 {
		a {
		}
	}
}
```

and you would like to replace the @hello block easily, balanced allows you to do this

```javascript
var balanced = require('node-balanced');

balanced.replacements({
	source: source,
	head: /@hello \d \{/, // optional (defalut: open)
	open: '{',
	close: '}',
	balance: false, // optional (default: false)
	exceptions: false, // optional (default: false)
	replace: function (source, head, tail) {
		return head + source + tail;
	}
});
```

this is a simple and efficient way to make balanced replacements, without a parser.

## matching

you can get balanced matches by doing the following

```javascript
var balanced = require('node-balanced');

balanced.matches({
	source: source,
	head: /@hello \d \{/, // optional (defalut: open)
	open: '{',
	close: '}',
	balance: false, // optional (default: false) when set to true it will return `null` when there is an error
	exceptions: false // optional (default: false)
});
```

## multiple head/open/close

you can match multiple head/open/close efficiently by doing this

```javascript
var isBalanced = balanced.matches({
	source: '{[({)]}}',
	open: ['{', '[', '('],
	close: ['}', ']', ')'],
	balance: true
});
```

## advanced

in this example we have code and we want to avoid replacing text thats inside of the comments

```css
{
	@hello 1 {
		a {
		}
	}
/*
	@hello 2 {
		a {
		}
	}
*/
	@hello 3 {
		a {
		}
	}
}
```

with balanced you can do this

```javascript
var comments = balanced.matches({source: source, open: '/*', close: '*/'}),
	matches = balanced.matches({source: source, head: /@hello \d \{/, open: '{', close: '}'});

matches = matches.filter(function (match) {
	var insideComment = false;

	comments.forEach(function (comment) {
		insideComment = match.index >= comment.index && match.index <= comment.index + comment.length;
	});

	return !insideComment;
});

balanced.replaceMatchesInString(matches, source, function (source, head, tail) {
	return head + source + tail;
});
```