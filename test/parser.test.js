import assert from "assert"
import { Parser } from '../index.js'

describe("parser", () => {

	it("invalid", () => {
		assert.throws(() =>	Parser.parse("38 +* 14"), Error)
		// assert.throws(() =>	Parser.parse("38 ++ 14"), Error) // throws if there is no space in between the plus signs
		assert.throws(() =>	Parser.parse("* 38"), Error)
		assert.throws(() =>	Parser.parse("-25 - -120 -"), Error)
		assert.throws(() =>	Parser.parse("-25 - -120 - -"), Error)
		assert.throws(() =>	Parser.parse("-25 - --120"), Error)
		assert.throws(() =>	Parser.parse("32 + 32 - 32."), Error)
		assert.throws(() =>	Parser.parse("32 + .32"), Error)
		assert.throws(() => Parser.parse("5 * (5 * - 180"), Error, "All groups should be closed")
		assert.doesNotThrow(() =>	Parser.parse("32 + 32.5"), Error, "Decimal separator should not throw when used before and after a digit.")
		assert.doesNotThrow(() => Parser.parse("2 * + 150"), Error, "We should be able to multiply an operand prefixed with a plus sign")
		assert.doesNotThrow(() => Parser.parse("5 * - 180"), Error, "We should be able to multiply a negative operand")
		// assert.throws(() =>	Parser.parse("61d2 - 5"), Error) // SyntaxError: identifier starts immediately after numeric literal
		// assert.throws(() =>	Parser.parse("3 2 + 5"), Error) // SyntaxError: unexpected token: numeric literal
	})

	it("schema", () => {
		const tokens = Parser.parse("3 * (8.5 + 9) * (23 + 5) * 2")
		assert.deepEqual(tokens, [
			{ name: 'operand', buffer: 3 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer: 17.5 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer: 28 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer: 2 }
		])
	})

	it("buffer", () => {

		assert.strictEqual(Parser.parse("4345345")[0].buffer, 4345345)
		assert.strictEqual(Parser.parse("3 + 1")[2].buffer, 1)
		assert.strictEqual(Parser.parse("25 + (6)")[1].buffer, "+")
		assert.strictEqual(Parser.parse("25 + (6)")[2].buffer, 6)
		assert.strictEqual(Parser.parse("98 + 20 * (45 * 2)")[0].buffer, 98)
		assert.strictEqual(Parser.parse("98 + 20 * (45 * 2)")[2].buffer, 20)
		assert.strictEqual(Parser.parse("98 + 20 * (45 * 2)")[4].buffer, 90)

	})

	it("parentheses", () => {
		assert.deepEqual(Parser.parse("38 +- 14 + (91 + 1) + 3 +- 2"), [
			{ name: 'operand', buffer: 38 },
			{ name: 'operator', buffer: '+' },
			{ name: 'operand', buffer: -14 },
			{ name: 'operator', buffer: '+' },
			{ name: 'operand', buffer: 92 },
			{ name: 'operator', buffer: '+' },
			{ name: 'operand', buffer: 3 },
			{ name: 'operator', buffer: '+' },
			{ name: 'operand', buffer: -2 }
		])
		assert.deepEqual(Parser.parse("234 - (324 - 23543.5) - 1.5"), [
			{ name: 'operand', buffer: 234 },
			{ name: 'operator', buffer: '-' },
			{ name: 'operand', buffer: -23219.5 },
			{ name: 'operator', buffer: '-' },
			{ name: 'operand', buffer: 1.5 },
		])
		assert.deepEqual(Parser.parse("51 / 111 / (5 / 1000) / 2"), [
			{ name: 'operand', buffer: 51 },
			{ name: 'operator', buffer: '/' },
			{ name: 'operand', buffer: 111 },
			{ name: 'operator', buffer: '/' },
			{ name: 'operand', buffer:  0.005 },
			{ name: 'operator', buffer: '/' },
			{ name: 'operand', buffer:  2 },
		])
	})

	it("multipleParentheses", () => {
		assert.deepEqual(Parser.parse("122 * (54534 * 5) * 1 * (2 * 4)"), [
			{ name: 'operand', buffer: 122 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer: 272670 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer:  1 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer:  8 },
		])
		assert.deepEqual(Parser.parse("122 * (525.34 / 5) % 1 * (2 + 4)"), [
			{ name: 'operand', buffer: 122 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer:  105.06800000000001 },
			{ name: 'operator', buffer: '%' },
			{ name: 'operand', buffer:  1 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer:  6 },
		])
		assert.deepEqual(Parser.parse("122 * (54534 * 5) / 6.5 * (2 - 4)"), [
			{ name: 'operand', buffer: 122 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer:  272670 },
			{ name: 'operator', buffer: '/' },
			{ name: 'operand', buffer:  6.5 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer:  -2 },
		])
	})

	it("nestedParentheses", () => {
		assert.deepEqual(Parser.parse("51 * 111 * (5 * 1000 * (5 * 5)) * 2"), [
			{ name: 'operand', buffer: 51 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer:  111 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer:  5000 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer:  25 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer:  2 },
		])
		assert.deepEqual(Parser.parse("51 * 111 * (5 * -1000 * (5 * 5)) * 2"), [
			{ name: 'operand', buffer: 51 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer: 111 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer: -5000 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer: 25 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer: 2 },
		])
		assert.deepEqual(Parser.parse("51 * 111 * (5 * 1000.231243 * (5 * 5)) * (2 * (5 + 5 * (2 * 2.432423 / (5 * 2))))"), [
			{ name: 'operand', buffer: 51 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer: 111 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer: 5001.156215 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer: 25 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer: 2 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer: 10 },
			{ name: 'operator', buffer: '*' },
			{ name: 'operand', buffer: 4.864846 },
			{ name: 'operator', buffer: '/' },
			{ name: 'operand', buffer: 10 },
		])
		assert.deepEqual(Parser.parse("511 % (111 % 5)"), [
			{ name: 'operand', buffer: 511 },
			{ name: 'operator', buffer: '%' },
			{ name: 'operand', buffer:  1 },
		])
	})

})
