var balanced = require('../index'),
	fs = require('fs');

var examples = {
	bracketsUnbalanced: fs.readFileSync(__dirname + '/example-text/brackets-unbalanced.txt', 'utf8'),
	bracketsUnbalanced2: fs.readFileSync(__dirname + '/example-text/brackets-unbalanced2.txt', 'utf8'),
	bracketsUnbalanced3: fs.readFileSync(__dirname + '/example-text/brackets-unbalanced3.txt', 'utf8'),
	bracketsUnbalanced4: fs.readFileSync(__dirname + '/example-text/brackets-unbalanced4.txt', 'utf8'),
	bracketsUnbalanced5: fs.readFileSync(__dirname + '/example-text/brackets-unbalanced5.txt', 'utf8')
};

describe('Balancing', function() {
	it('can perform a simple balance check', function() {
		var matches = balanced.matches({source: examples.bracketsUnbalanced, open: '{', close: '}', balance: true});
		expect(matches).toEqual(null);
	});

	it('can perform a more exact balance check', function() {
		var matches = balanced.matches({source: examples.bracketsUnbalanced2, open: '{', close: '}', balance: true});
		expect(matches).toEqual(null);
	});

	it('can match unbalanced source', function() {
		var matches = balanced.matches({source: examples.bracketsUnbalanced, open: '{', close: '}', balance: false});

		expect(matches).toEqual([
			{ index: 8, length: 6, head: '{', tail: '}' },
			{ index: 37, length: 9, head: '{', tail: '}' },
			{ index: 69, length: 10, head: '{', tail: '}' },
			{ index: 94, length: 25, head: '{', tail: '}' }
		]);
	});

	it('can replace while unbalanced', function () {
		expect(balanced.replacements({
		    source: 'unbalanced{source',
		    open: ['{'],
		    close: ['}'],
		    balance: true,
		    exceptions: false,
		    replace: function () {
		    	return '';
		    }
		})).toEqual('unbalanced{source');
	});

	it('can replace with numbers', function () {
		expect(balanced.replacements({
			source: "{?}{?}",
			open: "{",
			close: "}",
			replace: function(match, head, tail) {
				return 1;
			}
		})).toEqual('11');
	});


	it('can match bad unbalanced source', function() {
		var matches = balanced.matches({source: examples.bracketsUnbalanced2, open: '{', close: '}', balance: false});
		expect(matches).toEqual([]);
	});

	it('can match throw error for unbalanced source', function() {
		var errorMessage;
		try {
			balanced.matches({source: examples.bracketsUnbalanced, open: '{', close: '}', balance: true, exceptions: true});
		} catch (error) {
			errorMessage = error.message;
		}

		expect(errorMessage).toEqual(
			'Balanced: unexpected close bracket at 1:1\n\n1: }GARBAGE{TEXT}GARBAGE\n---^\n2: GARBAGE\n3: GARBAGE{'
		);
	});

	it('can match throw error for bad unbalanced source', function() {
		var errorMessage;
		try {
			balanced.matches({source: examples.bracketsUnbalanced2, open: '{', close: '}', balance: true, exceptions: true});
		} catch (error) {
			errorMessage = error.message;
		}

		expect(errorMessage).toEqual(
			'Balanced: unexpected close bracket at 1:1\n\n1: }{GARBAGE{TEXT}GARBAGE\n---^\n2: GARBAGE\n3: GARBAGE{'
		);
	});

	it('can perform a balance check with multiple open/close', function () {
		var errorMessage;
		try {
			balanced.matches({
				source: examples.bracketsUnbalanced3,
				head: ['{', '[', '('],
				open: ['{', '[', '('],
				close: ['}', ']', ')'],
				balance: true,
				exceptions: true
			});
		} catch (error) {
			errorMessage = error.message;
		}

		expect(errorMessage).toEqual(
			'Balanced: mismatching close bracket, expected \"]\" but found \"}\" at 5:3\n\n3:   {\n4:    TEXT[\n5:   }\n-----^\n6:   {\n7:    TEXT]'
		);
	});

	it('can perform an unbalanced match with multiple open/close', function () {
		expect(balanced.matches({
			source: examples.bracketsUnbalanced4,
			open: ['{', '[', '('],
			close: ['}', ']', ')']
		})).toEqual([
			{ index: 0, length: 73, head: '{', tail: '}' },
			{ index: 74, length: 73, head: '(', tail: ')' }
		]);
	});

	it('can perform an unbalanced match with multiple head/open/close', function () {
		expect(balanced.matches({
			source: examples.bracketsUnbalanced4,
			head: ['a {', 'a [', 'a ('],
			open: ['{', '[', '('],
			close: ['}', ']', ')'],
		})).toEqual([
			{ index: 44, length: 7, head: 'a {', tail: '}' },
			{ index: 54, length: 7, head: 'a [', tail: ']' },
			{ index: 64, length: 7, head: 'a (', tail: ')' },
			{ index: 118, length: 7, head: 'a {', tail: '}' },
			{ index: 128, length: 7, head: 'a [', tail: ']' },
			{ index: 138, length: 7, head: 'a (', tail: ')' }
		]);
	});

	it('can perform a balance check with multiple open/close, and multiple line returns', function () {
		var errorMessage;
		try {
			balanced.matches({
				source: examples.bracketsUnbalanced5,
				head: ['{', '[', '('],
				open: ['{', '[', '('],
				close: ['}', ']', ')'],
				balance: true,
				exceptions: true
			});
		} catch (error) {
			errorMessage = error.message;
		}

		expect(errorMessage).toEqual(
			'Balanced: mismatching close bracket, expected \"]\" but found \"}\" at 6:3\n\n4:   {\n5:    TEXT[\n6:   }\n-----^\n7:   {\n8:    TEXT]'
		);
	});
});