import assert from "assert"
import { Tokenizer } from '../index.js'

describe("tokenizer", () => {

	it("schema", () => {
		const tokens = Tokenizer.tokenize("3 + 8.5 + -9 + (23 * 2)")

		assert.deepEqual(tokens, [
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
	})

	it("buffer", () => {

		assert.strictEqual(Tokenizer.tokenize("4345345")[0].buffer, "4")
		assert.strictEqual(Tokenizer.tokenize("3 + 1")[2].buffer, "1")
		assert.strictEqual(Tokenizer.tokenize("25 + (6)")[2].buffer, "+")
		assert.strictEqual(Tokenizer.tokenize("98 + 20 * (45 * 2)")[0].buffer, "9")
		assert.strictEqual(Tokenizer.tokenize("98 + 20.5 * (45 * 2)")[1].buffer, "8")
		assert.strictEqual(Tokenizer.tokenize("98 + 20 * (45 * 2)")[3].buffer, "2")
		assert.strictEqual(Tokenizer.tokenize("98 + 20 * (45 * 2)")[6].buffer, "(")
		assert.strictEqual(Tokenizer.tokenize("98 + 20 * (45 * 2)")[7].buffer, "4")

	})

	it("bufferIndex", () => {

		assert.strictEqual(Tokenizer.tokenize("198 / 20 * 1")[0].bufferIndex, 0)
		assert.strictEqual(Tokenizer.tokenize("198 / 20 * 1")[1].bufferIndex, 1)
		assert.strictEqual(Tokenizer.tokenize("(198 / 20) * 1")[6].bufferIndex, 8)
		assert.strictEqual(Tokenizer.tokenize("25.9 * 2.6 + 9")[4].bufferIndex, 5)
		assert.strictEqual(Tokenizer.tokenize("76 % 9 / 1")[3].bufferIndex, 5)

	})

	it("name", () => {

		const tokens = Tokenizer.tokenize("(0) + 1.5 % (1 / 2) - 2 * 1")

		assert.strictEqual(tokens[0].name, "left parenthesis")
		assert.strictEqual(tokens[1].name, "operand")
		assert.strictEqual(tokens[2].name, "right parenthesis")
		assert.strictEqual(tokens[3].name, "operator")
		assert.strictEqual(tokens[4].name, "operand")
		assert.strictEqual(tokens[5].name, "operand")
		assert.strictEqual(tokens[6].name, "operand")
		assert.strictEqual(tokens[7].name, "operator")
		assert.strictEqual(tokens[8].name, "left parenthesis")
		assert.strictEqual(tokens[9].name, "operand")
		assert.strictEqual(tokens[10].name, "operator")
		assert.strictEqual(tokens[11].name, "operand")
		assert.strictEqual(tokens[12].name, "right parenthesis")
		assert.strictEqual(tokens[13].name, "operator")
		assert.strictEqual(tokens[14].name, "operand")
		assert.strictEqual(tokens[15].name, "operator")
		assert.strictEqual(tokens[16].name, "operand")

	})


})
