var balanced = require('../index'),
	fs = require('fs');

var examples = {
	bracketsBasic: fs.readFileSync(__dirname + '/example-text/brackets-basic.txt', 'utf8'),
	bracketsHead: fs.readFileSync(__dirname + '/example-text/brackets-head.txt', 'utf8')
};

describe('Replacements', function() {
	it('can perform simple string replacements', function() {
		expect(balanced.replacements({source: examples.bracketsBasic, right: '{', left: '}', replace: function (source, head, tail) {
			return '<REPLACED>' + source + '</REPLACED>';
		}})).toEqual(
			'GARBAGE<REPLACED>TEXT</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\tTEXT\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>{{TEXT}}</REPLACED>GARBAGE\nGARBAGE<REPLACED>\n\t{\n\t\t{\n\t\t\tTEXT\n\t\t}\n\t}\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\t{TEXT}\n\t{TEXT}\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE(TEXT)GARBAGE\nGARBAGE\nGARBAGE(\n\tTEXT\n)GARBAGE\nGARBAGE\nGARBAGE(((TEXT)))GARBAGE\nGARBAGE(\n\t(\n\t\t(\n\t\t\tTEXT\n\t\t)\n\t)\n)GARBAGE\nGARBAGE\nGARBAGE(\n\t(TEXT)\n\t(TEXT)\n)GARBAGE\nGARBAGE\nGARBAGE[TEXT]GARBAGE\nGARBAGE\nGARBAGE[\n\tTEXT\n]GARBAGE\nGARBAGE\nGARBAGE[[[TEXT]]]GARBAGE\nGARBAGE[\n\t[\n\t\t[\n\t\t\tTEXT\n\t\t]\n\t]\n]GARBAGE\nGARBAGE\nGARBAGE[\n\t[TEXT]\n\t[TEXT]\n]GARBAGE\nGARBAGE\nGARBAGE<tag>TEXT</tag>GARBAGE\nGARBAGE\nGARBAGE<tag>\n\tTEXT\n</tag>GARBAGE\nGARBAGE\nGARBAGE<tag><tag><tag>TEXT</tag></tag></tag>GARBAGE\nGARBAGE<tag>\n\t<tag>\n\t\t<tag>\n\t\t\tTEXT\n\t\t</tag>\n\t</tag>\n</tag>GARBAGE\nGARBAGE\nGARBAGE<tag>\n\t<tag>TEXT</tag>\n\t<tag>TEXT</tag>\n</tag>GARBAGE\nGARBAGE'
		);

		expect(balanced.replacements({source: examples.bracketsBasic, right: '(', left: ')', replace: function (source, head, tail) {
			return '<REPLACED>' + source + '</REPLACED>';
		}})).toEqual(
			'GARBAGE{TEXT}GARBAGE\nGARBAGE\nGARBAGE{\n\tTEXT\n}GARBAGE\nGARBAGE\nGARBAGE{{{TEXT}}}GARBAGE\nGARBAGE{\n\t{\n\t\t{\n\t\t\tTEXT\n\t\t}\n\t}\n}GARBAGE\nGARBAGE\nGARBAGE{\n\t{TEXT}\n\t{TEXT}\n}GARBAGE\nGARBAGE\nGARBAGE<REPLACED>TEXT</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\tTEXT\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>((TEXT))</REPLACED>GARBAGE\nGARBAGE<REPLACED>\n\t(\n\t\t(\n\t\t\tTEXT\n\t\t)\n\t)\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\t(TEXT)\n\t(TEXT)\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE[TEXT]GARBAGE\nGARBAGE\nGARBAGE[\n\tTEXT\n]GARBAGE\nGARBAGE\nGARBAGE[[[TEXT]]]GARBAGE\nGARBAGE[\n\t[\n\t\t[\n\t\t\tTEXT\n\t\t]\n\t]\n]GARBAGE\nGARBAGE\nGARBAGE[\n\t[TEXT]\n\t[TEXT]\n]GARBAGE\nGARBAGE\nGARBAGE<tag>TEXT</tag>GARBAGE\nGARBAGE\nGARBAGE<tag>\n\tTEXT\n</tag>GARBAGE\nGARBAGE\nGARBAGE<tag><tag><tag>TEXT</tag></tag></tag>GARBAGE\nGARBAGE<tag>\n\t<tag>\n\t\t<tag>\n\t\t\tTEXT\n\t\t</tag>\n\t</tag>\n</tag>GARBAGE\nGARBAGE\nGARBAGE<tag>\n\t<tag>TEXT</tag>\n\t<tag>TEXT</tag>\n</tag>GARBAGE\nGARBAGE'
		);

		expect(balanced.replacements({source: examples.bracketsBasic, right: '[', left: ']', replace: function (source, head, tail) {
			return '<REPLACED>' + source + '</REPLACED>';
		}})).toEqual(
			'GARBAGE{TEXT}GARBAGE\nGARBAGE\nGARBAGE{\n\tTEXT\n}GARBAGE\nGARBAGE\nGARBAGE{{{TEXT}}}GARBAGE\nGARBAGE{\n\t{\n\t\t{\n\t\t\tTEXT\n\t\t}\n\t}\n}GARBAGE\nGARBAGE\nGARBAGE{\n\t{TEXT}\n\t{TEXT}\n}GARBAGE\nGARBAGE\nGARBAGE(TEXT)GARBAGE\nGARBAGE\nGARBAGE(\n\tTEXT\n)GARBAGE\nGARBAGE\nGARBAGE(((TEXT)))GARBAGE\nGARBAGE(\n\t(\n\t\t(\n\t\t\tTEXT\n\t\t)\n\t)\n)GARBAGE\nGARBAGE\nGARBAGE(\n\t(TEXT)\n\t(TEXT)\n)GARBAGE\nGARBAGE\nGARBAGE<REPLACED>TEXT</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\tTEXT\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>[[TEXT]]</REPLACED>GARBAGE\nGARBAGE<REPLACED>\n\t[\n\t\t[\n\t\t\tTEXT\n\t\t]\n\t]\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\t[TEXT]\n\t[TEXT]\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<tag>TEXT</tag>GARBAGE\nGARBAGE\nGARBAGE<tag>\n\tTEXT\n</tag>GARBAGE\nGARBAGE\nGARBAGE<tag><tag><tag>TEXT</tag></tag></tag>GARBAGE\nGARBAGE<tag>\n\t<tag>\n\t\t<tag>\n\t\t\tTEXT\n\t\t</tag>\n\t</tag>\n</tag>GARBAGE\nGARBAGE\nGARBAGE<tag>\n\t<tag>TEXT</tag>\n\t<tag>TEXT</tag>\n</tag>GARBAGE\nGARBAGE'
		);

		expect(balanced.replacements({source: examples.bracketsBasic, right: '<tag>', left: '</tag>', replace: function (source, head, tail) {
			return '<REPLACED>' + source + '</REPLACED>';
		}})).toEqual(
			'GARBAGE{TEXT}GARBAGE\nGARBAGE\nGARBAGE{\n\tTEXT\n}GARBAGE\nGARBAGE\nGARBAGE{{{TEXT}}}GARBAGE\nGARBAGE{\n\t{\n\t\t{\n\t\t\tTEXT\n\t\t}\n\t}\n}GARBAGE\nGARBAGE\nGARBAGE{\n\t{TEXT}\n\t{TEXT}\n}GARBAGE\nGARBAGE\nGARBAGE(TEXT)GARBAGE\nGARBAGE\nGARBAGE(\n\tTEXT\n)GARBAGE\nGARBAGE\nGARBAGE(((TEXT)))GARBAGE\nGARBAGE(\n\t(\n\t\t(\n\t\t\tTEXT\n\t\t)\n\t)\n)GARBAGE\nGARBAGE\nGARBAGE(\n\t(TEXT)\n\t(TEXT)\n)GARBAGE\nGARBAGE\nGARBAGE[TEXT]GARBAGE\nGARBAGE\nGARBAGE[\n\tTEXT\n]GARBAGE\nGARBAGE\nGARBAGE[[[TEXT]]]GARBAGE\nGARBAGE[\n\t[\n\t\t[\n\t\t\tTEXT\n\t\t]\n\t]\n]GARBAGE\nGARBAGE\nGARBAGE[\n\t[TEXT]\n\t[TEXT]\n]GARBAGE\nGARBAGE\nGARBAGE<REPLACED>TEXT</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\tTEXT\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED><tag><tag>TEXT</tag></tag></REPLACED>GARBAGE\nGARBAGE<REPLACED>\n\t<tag>\n\t\t<tag>\n\t\t\tTEXT\n\t\t</tag>\n\t</tag>\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\t<tag>TEXT</tag>\n\t<tag>TEXT</tag>\n</REPLACED>GARBAGE\nGARBAGE'
		);
	});

	it('can perform simple regexp replacements', function() {
		expect(balanced.replacements({source: examples.bracketsBasic, right: /\[|\{|\(|<tag>/, left: /\]|\}|\)|<\/tag>/, replace: function (source, head, tail) {
			return '<REPLACED>' + source + '</REPLACED>';
		}})).toEqual(
			'GARBAGE<REPLACED>TEXT</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\tTEXT\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>{{TEXT}}</REPLACED>GARBAGE\nGARBAGE<REPLACED>\n\t{\n\t\t{\n\t\t\tTEXT\n\t\t}\n\t}\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\t{TEXT}\n\t{TEXT}\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>TEXT</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\tTEXT\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>((TEXT))</REPLACED>GARBAGE\nGARBAGE<REPLACED>\n\t(\n\t\t(\n\t\t\tTEXT\n\t\t)\n\t)\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\t(TEXT)\n\t(TEXT)\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>TEXT</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\tTEXT\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>[[TEXT]]</REPLACED>GARBAGE\nGARBAGE<REPLACED>\n\t[\n\t\t[\n\t\t\tTEXT\n\t\t]\n\t]\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\t[TEXT]\n\t[TEXT]\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>TEXT</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\tTEXT\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED><tag><tag>TEXT</tag></tag></REPLACED>GARBAGE\nGARBAGE<REPLACED>\n\t<tag>\n\t\t<tag>\n\t\t\tTEXT\n\t\t</tag>\n\t</tag>\n</REPLACED>GARBAGE\nGARBAGE\nGARBAGE<REPLACED>\n\t<tag>TEXT</tag>\n\t<tag>TEXT</tag>\n</REPLACED>GARBAGE\nGARBAGE'
		);
	});

	it('can perform head replacements', function () {
		expect(balanced.replacements({source: examples.bracketsHead, head: 'head (', right: '(', left: ')', replace: function (source, head, tail) {
			return '<REPLACED>' + source + '</REPLACED>';
		}})).toEqual(
			'GARBAGE <REPLACED>\n\t(\n\t\t(\n\t\t\tTEXT\n\t\t)\n\t)\n\thead ()\n</REPLACED>GARBAGE\nGARBAGE head2 (\n\t(\n\t\t(\n\t\t\tTEXT\n\t\t)\n\t)\n\thead2 ()\n)GARBAGE\nGARBAGE <REPLACED>\n\t(\n\t\t(\n\t\t\tTEXT\n\t\t)\n\t)\n\thead ()\n</REPLACED>GARBAGE\nGARBAGE head2 (\n\t(\n\t\t(\n\t\t\tTEXT\n\t\t)\n\t)\n\thead2 ()\n)GARBAGE'
		);
	});

	it('can perform regexp head matches', function () {
		expect(balanced.replacements({source: examples.bracketsHead, head: /head\d? \(/, right: '(', left: ')', replace: function (source, head, tail) {
			return '<REPLACED>' + source + '</REPLACED>';
		}})).toEqual(
			'GARBAGE <REPLACED>\n\t(\n\t\t(\n\t\t\tTEXT\n\t\t)\n\t)\n\thead ()\n</REPLACED>GARBAGE\nGARBAGE <REPLACED>\n\t(\n\t\t(\n\t\t\tTEXT\n\t\t)\n\t)\n\thead2 ()\n</REPLACED>GARBAGE\nGARBAGE <REPLACED>\n\t(\n\t\t(\n\t\t\tTEXT\n\t\t)\n\t)\n\thead ()\n</REPLACED>GARBAGE\nGARBAGE <REPLACED>\n\t(\n\t\t(\n\t\t\tTEXT\n\t\t)\n\t)\n\thead2 ()\n</REPLACED>GARBAGE'
		);
	});
});