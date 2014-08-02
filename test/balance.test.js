var balanced = require('../index'),
	fs = require('fs');

var examples = {
	bracketsUnbalanced: fs.readFileSync(__dirname + '/example-text/brackets-unbalanced.txt'),
	bracketsUnbalanced2: fs.readFileSync(__dirname + '/example-text/brackets-unbalanced2.txt')
};

describe('Balancing', function() {
	it('can perform a simple balance check', function() {
		var matches = balanced.matches({source: examples.bracketsUnbalanced, right: '{', left: '}', balance: true});
		expect(matches).toEqual(null);
	});

	it('can perform a more exact balance check', function() {
		var matches = balanced.matches({source: examples.bracketsUnbalanced2, right: '{', left: '}', balance: true});
		expect(matches).toEqual(null);
	});

	it('can match unbalanced source', function() {
		var matches = balanced.matches({source: examples.bracketsUnbalanced, right: '{', left: '}', balance: false});

		expect(matches).toEqual([
			{ index: 8, length: 6, head: '{', tail: '}' },
			{ index: 37, length: 9, head: '{', tail: '}' },
			{ index: 69, length: 10, head: '{', tail: '}' },
			{ index: 94, length: 25, head: '{', tail: '}' }
		]);
	});

	it('can match bad unbalanced source', function() {
		var matches = balanced.matches({source: examples.bracketsUnbalanced2, right: '{', left: '}', balance: false});
		expect(matches).toEqual([]);
	});

	it('can match throw error for unbalanced source', function() {
		var errorMessage;
		try {
			balanced.matches({source: examples.bracketsUnbalanced, right: '{', left: '}', balance: true, exceptions: true});
		} catch (error) {
			errorMessage = error.message;
		}

		expect(errorMessage).toEqual('Balanced: expected right bracket at 0');
	});

	it('can match throw error for bad unbalanced source', function() {
		var errorMessage;
		try {
			balanced.matches({source: examples.bracketsUnbalanced2, right: '{', left: '}', balance: true, exceptions: true});
		} catch (error) {
			errorMessage = error.message;
		}

		expect(errorMessage).toEqual('Balanced: expected right bracket at 0');
	});
});