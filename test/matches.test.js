var balanced = require('../index'),
	fs = require('fs');

var examples = {
	bracketsBasic: fs.readFileSync(__dirname + '/example-text/brackets-basic.txt'),
	bracketsHead: fs.readFileSync(__dirname + '/example-text/brackets-head.txt')
};

describe('Matches', function() {
	it('can perform simple string matches', function() {
		expect(balanced.matches({source: examples.bracketsBasic, open: '{', close: '}'})).toEqual([
			{ index: 7, length: 6, head: '{', tail: '}' },
			{ index: 36, length: 9, head: '{', tail: '}' },
			{ index: 68, length: 10, head: '{', tail: '}' },
			{ index: 93, length: 25, head: '{', tail: '}' },
			{ index: 141, length: 19, head: '{', tail: '}' }
  		]);

  		expect(balanced.matches({source: examples.bracketsBasic, open: '(', close: ')'})).toEqual([
			{ index: 183, length: 6, head: '(', tail: ')' },
			{ index: 212, length: 9, head: '(', tail: ')' },
			{ index: 244, length: 10, head: '(', tail: ')' },
			{ index: 269, length: 25, head: '(', tail: ')' },
			{ index: 317, length: 19, head: '(', tail: ')' }
  		]);

  		expect(balanced.matches({source: examples.bracketsBasic, open: '[', close: ']'})).toEqual([
			{ index: 359, length: 6, head: '[', tail: ']' },
			{ index: 388, length: 9, head: '[', tail: ']' },
			{ index: 420, length: 10, head: '[', tail: ']' },
			{ index: 445, length: 25, head: '[', tail: ']' },
			{ index: 493, length: 19, head: '[', tail: ']' }
  		]);

  		expect(balanced.matches({source: examples.bracketsBasic, open: '<tag>', close: '</tag>'})).toEqual([
			{ index: 535, length: 15, head: '<tag>', tail: '</tag>' },
			{ index: 573, length: 18, head: '<tag>', tail: '</tag>' },
			{ index: 614, length: 37, head: '<tag>', tail: '</tag>' },
			{ index: 666, length: 52, head: '<tag>', tail: '</tag>' },
			{ index: 741, length: 46, head: '<tag>', tail: '</tag>' }
		]);
	});

	it('can perform simple regexp matches', function() {
		expect(balanced.matches({source: examples.bracketsBasic, open: /\[|\{|\(|<tag>/, close: /\]|\}|\)|<\/tag>/})).toEqual([
			{ index: 7, length: 6, head: '{', tail: '}' },
			{ index: 36, length: 9, head: '{', tail: '}' },
			{ index: 68, length: 10, head: '{', tail: '}' },
			{ index: 93, length: 25, head: '{', tail: '}' },
			{ index: 141, length: 19, head: '{', tail: '}' },
			{ index: 183, length: 6, head: '(', tail: ')' },
			{ index: 212, length: 9, head: '(', tail: ')' },
			{ index: 244, length: 10, head: '(', tail: ')' },
			{ index: 269, length: 25, head: '(', tail: ')' },
			{ index: 317, length: 19, head: '(', tail: ')' },
			{ index: 359, length: 6, head: '[', tail: ']' },
			{ index: 388, length: 9, head: '[', tail: ']' },
			{ index: 420, length: 10, head: '[', tail: ']' },
			{ index: 445, length: 25, head: '[', tail: ']' },
			{ index: 493, length: 19, head: '[', tail: ']' },
			{ index: 535, length: 15, head: '<tag>', tail: '</tag>' },
			{ index: 573, length: 18, head: '<tag>', tail: '</tag>' },
			{ index: 614, length: 37, head: '<tag>', tail: '</tag>' },
			{ index: 666, length: 52, head: '<tag>', tail: '</tag>' },
			{ index: 741, length: 46, head: '<tag>', tail: '</tag>' }
		]);
	});

	it('can perform head matches', function () {
		expect(balanced.matches({source: examples.bracketsHead, head: 'head (', open: '(', close: ')'})).toEqual([
			{ index: 8, length: 39, head: 'head (', tail: ')' },
			{ index: 120, length: 39, head: 'head (', tail: ')' }
		]);
	});

	it('can perform regexp head matches', function () {
		expect(balanced.matches({source: examples.bracketsHead, head: /head\d? \(/, open: '(', close: ')'})).toEqual([
			{ index: 8, length: 39, head: 'head (', tail: ')' },
			{ index: 63, length: 41, head: 'head2 (', tail: ')' },
			{ index: 120, length: 39, head: 'head (', tail: ')' },
			{ index: 175, length: 41, head: 'head2 (', tail: ')' }
		]);
	});
});