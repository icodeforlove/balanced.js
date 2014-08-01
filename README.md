# Balanced

balanced string matching, and replacing.

# install

```
	npm install node-balanced
```

## example time

lets say you have

```
{
	@hello 1 {
		a {
			b {
				c {

				}
			}
		}
	}
	@hello 2 {
		a {
			b {
				c {

				}
			}
		}
	}
	@hello 3 {
		a {
			b {
				c {

				}
			}
		}
	}
}
```

and you would like to replace the @hello block easily, balanced allows you to do this

```
var balanced = require('node-balanced');

balanced.replacements({
	source: source,
	head: /@hello \d \{/,
	right: '{',
	left: '}',
	replace: function (source, head, tail) {
		return head + source + tail;
	}
});
```

this is a simple and efficient way to make balanced replacements, without a parser.

## matching

you can get balanced matches by doing the following

```
var balanced = require('node-balanced');

balanced.matches({
	source: source,
	head: /@hello \d \{/,
	right: '{',
	left: '}'
});
```

## advanced

in this example we have code and we want to avoid replacing text thats inside of the comments

```
	{
		@hello 1 {
			a {
				b {
					c {

					}
				}
			}
		}
	/*
		@hello 2 {
			a {
				b {
					c {

					}
				}
			}
		}
	*/
		@hello 3 {
			a {
				b {
					c {

					}
				}
			}
		}
	}
```

with balanced you can do this

```
	var comments = balanced.matches({source: source, right: '/*', left: '*/'}),
		matches = balanced.matches({source: source, head: /@hello \d \{/, right: '{', left: '}'});

	matches.filter(function (match) {
		var insideComment = false;

		comments.forEach(function (comment) {
			insideComment = match.index >= comment.index && match.index <= comment.index + comment.length;
		});

		return !insideComment;
	});

	balanced.replaceMatchesInString(string, matches, function (source, head, tail) {
		return head + source + tail;
	});
```