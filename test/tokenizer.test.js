import { Tokenizer } from '../index.js'

export function schema(test) {
	test.expect(1)
	const tokens = Tokenizer.tokenize("3 + 8.5 + -9 + (23 * 2)")

	test.deepEqual(tokens, [
		{ name: "operand", buffer: "3", bufferIndex: 0 },
		{ name: "operator", buffer: "+", bufferIndex: 2 },
		{ name: "operand", buffer: "8", bufferIndex: 4 },
		{ name: "operand", buffer: ".", bufferIndex: 5 },
		{ name: "operand", buffer: "5", bufferIndex: 6 },
		{ name: "operator", buffer: "+", bufferIndex: 8 },
		{ name: "operator", buffer: "-", bufferIndex:  10 },
		{ name: "operand", buffer: "9", bufferIndex:  11 },
		{ name: "operator", buffer: "+", bufferIndex: 13 },
		{ name: "left parenthesis", buffer: "(", bufferIndex: 15 },
		{ name: "operand", buffer: "2", bufferIndex: 16 },
		{ name: "operand", buffer: "3", bufferIndex: 17 },
		{ name: "operator", buffer: "*", bufferIndex: 19 },
		{ name: "operand", buffer: "2", bufferIndex: 21 },
		{ name: "right parenthesis", buffer: ")", bufferIndex: 22 }
	])
	test.done()
}

export function buffer(test) {
	test.expect(8)

	test.strictEqual(Tokenizer.tokenize("4345345")[0].buffer, "4")
	test.strictEqual(Tokenizer.tokenize("3 + 1")[2].buffer, "1")
	test.strictEqual(Tokenizer.tokenize("25 + (6)")[2].buffer, "+")
	test.strictEqual(Tokenizer.tokenize("98 + 20 * (45 * 2)")[0].buffer, "9")
	test.strictEqual(Tokenizer.tokenize("98 + 20.5 * (45 * 2)")[1].buffer, "8")
	test.strictEqual(Tokenizer.tokenize("98 + 20 * (45 * 2)")[3].buffer, "2")
	test.strictEqual(Tokenizer.tokenize("98 + 20 * (45 * 2)")[6].buffer, "(")
	test.strictEqual(Tokenizer.tokenize("98 + 20 * (45 * 2)")[7].buffer, "4")

	test.done()
}

export function bufferIndex(test) {
	test.expect(5)

	test.strictEqual(Tokenizer.tokenize("198 / 20 * 1")[0].bufferIndex, 0)
	test.strictEqual(Tokenizer.tokenize("198 / 20 * 1")[1].bufferIndex, 1)
	test.strictEqual(Tokenizer.tokenize("(198 / 20) * 1")[6].bufferIndex, 8)
	test.strictEqual(Tokenizer.tokenize("25.9 * 2.6 + 9")[4].bufferIndex, 5)
	test.strictEqual(Tokenizer.tokenize("76 % 9 / 1")[3].bufferIndex, 5)

	test.done()
}

export function name(test) {
	test.expect(17)

	const tokens = Tokenizer.tokenize("(0) + 1.5 % (1 / 2) - 2 * 1")

	test.strictEqual(tokens[0].name, "left parenthesis")
	test.strictEqual(tokens[1].name, "operand")
	test.strictEqual(tokens[2].name, "right parenthesis")
	test.strictEqual(tokens[3].name, "operator")
	test.strictEqual(tokens[4].name, "operand")
	test.strictEqual(tokens[5].name, "operand")
	test.strictEqual(tokens[6].name, "operand")
	test.strictEqual(tokens[7].name, "operator")
	test.strictEqual(tokens[8].name, "left parenthesis")
	test.strictEqual(tokens[9].name, "operand")
	test.strictEqual(tokens[10].name, "operator")
	test.strictEqual(tokens[11].name, "operand")
	test.strictEqual(tokens[12].name, "right parenthesis")
	test.strictEqual(tokens[13].name, "operator")
	test.strictEqual(tokens[14].name, "operand")
	test.strictEqual(tokens[15].name, "operator")
	test.strictEqual(tokens[16].name, "operand")

	test.done()
}
