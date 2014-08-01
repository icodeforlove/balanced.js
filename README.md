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
	start: /@hello \d \{/,
	right: '{',
	left: '}',
	replace: function (source, opening, closing) {
		return opening + source + closing;
	}
});
```

this is a simple and efficient way to make balanced replacements, without a parser.