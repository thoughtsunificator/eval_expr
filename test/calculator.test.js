import assert from "assert"
import { Calculator } from '../index.js'

describe("calculator", () => {

	it("addition", () => {
		assert.strictEqual(Calculator.compute( "5 + 1" ), 6)
		assert.strictEqual(Calculator.compute( "1 + 1 + 1" ), 3)
		assert.strictEqual(Calculator.compute( "100 + 25 + 0 + 0 + 9" ), 134)
		assert.strictEqual(Calculator.compute( "51 + 111 + 5 + 1000 + 2" ), 1169)
		assert.strictEqual(Calculator.compute( "234 + 324 + 23543.5 + 1.5" ), 24103)
		assert.strictEqual(Calculator.compute( "38 +- 14 + 91 + 1 + 3 +- 2" ), 117)
	})

	it("substraction", () => {
		assert.strictEqual(Calculator.compute( "0 - 1" ), -1)
		assert.strictEqual(Calculator.compute( "1 - 1 - 13243" ), -13243)
		assert.strictEqual(Calculator.compute( "51 - 111 - 5 - 1000 - 2" ), -1067)
		assert.strictEqual(Calculator.compute( "234 - 324 - 23543.5 - 1.5" ), -23635)
		assert.strictEqual(Calculator.compute( "-25 - 25 - 0 - -120 - 9" ), 61)
	})

	it("division", () => {
		assert.strictEqual(Calculator.compute( "0 / 1" ), 0)
		assert.ok(isNaN(Calculator.compute( "0 / 0" )))
		assert.strictEqual(Calculator.compute( "-25 / 25 / 0 / -0 / 9" ), Infinity)
		assert.strictEqual(Calculator.compute( "51 / 111 / 5 / 1000 / 2" ), 0.00004594594594594595)
	})

	it("multiplication", () => {
		assert.strictEqual(Calculator.compute( "0 * 1" ), 0)
		assert.strictEqual(Calculator.compute( "2 * + 150" ), 300)
		assert.strictEqual(Calculator.compute( "5 * - 180" ), -900)
		assert.strictEqual(Calculator.compute( "51 * 111 * 5 * 1000 * 2" ), 56610000)
		assert.strictEqual(Calculator.compute( "3 * 111.5" ), 334.5)
	})

	it("modulo", () => {
		assert.strictEqual(Calculator.compute( "0 % 1" ), 0)
		assert.strictEqual(Calculator.compute( "0 % + 121" ), 0)
		assert.strictEqual(Calculator.compute( "0 % - 990" ), 0)
		assert.strictEqual(Calculator.compute( "23 % 12 % 511" ), 11)
		assert.strictEqual(Calculator.compute( "5 % 1555 % 555" ), 5)
		assert.ok(isNaN(Calculator.compute( "1 % 0" )))
		assert.strictEqual(Calculator.compute( "3 % 111.5" ), 3)
	})

	it("order", () => {
		assert.strictEqual(Calculator.compute( "5 + 5 * 2" ), 20)
		assert.strictEqual(Calculator.compute( "5 - 1 / 2" ), 4.5)
		assert.strictEqual(Calculator.compute( "990 - 7 % 10" ), 983)
	})

	it("parentheses", () => {
		assert.strictEqual(Calculator.compute( "38 +- 14 + (91 + 1) + 3 +- 2" ), 117)
		assert.strictEqual(Calculator.compute( "234 - (324 - 23543.5) - 1.5" ), 23452)
		assert.strictEqual(Calculator.compute( "51 / 111 / (5 / 1000) / 2" ), 45.94594594594595)
	})

	it("multipleParentheses", () => {
		assert.strictEqual(Calculator.compute( "122 * (54534 * 5) * 1 * (2 * 4)" ), 266125920)
		assert.strictEqual(Calculator.compute( "122 * (525.34 / 5) % 1 * (2 + 4)" ), 1.7760000000125729)
		assert.strictEqual(Calculator.compute( "122 * (54534 * 5) / 6.5 * (2 - 4)" ), -10235612.307692308)
	})

	it("nestedParentheses", () => {
		assert.strictEqual(Calculator.compute( "51 * 111 * (5 * 1000 * (5 * 5)) * 2" ), 1415250000)
		assert.strictEqual(Calculator.compute( "51 * 111 * (5 * -1000 * (5 * 5)) * 2" ), -1415250000)
		assert.strictEqual(Calculator.compute( "51 * 111 * (5 * 1000.231243 * (5 * 5))" ), 707788633.327875)
		assert.strictEqual(Calculator.compute( "5 + (5 * (2 * 2.432423 / (5 * 2)))" ),  7.432423)
		assert.strictEqual(Calculator.compute( "(2 * (5 + (5 * (2 * 2.432423 / (5 * 2)))))" ), 14.864846)
		assert.strictEqual(Calculator.compute( "51 * 111 * (5 * 1000.231243 * (5 * 5)) * (2 * (5 + (5 * (2 * 2.432423 / (5 * 2)))))" ), 10521169034.96933)
		assert.strictEqual(Calculator.compute( "511 % (111 % 5)" ), 0)
	})

})
