import { Calculator } from '../index.js'

export function addition(test) {
	test.expect(6)
	test.strictEqual(Calculator.compute( "5 + 1" ), 6)
	test.strictEqual(Calculator.compute( "1 + 1 + 1" ), 3)
	test.strictEqual(Calculator.compute( "100 + 25 + 0 + 0 + 9" ), 134)
	test.strictEqual(Calculator.compute( "51 + 111 + 5 + 1000 + 2" ), 1169)
	test.strictEqual(Calculator.compute( "234 + 324 + 23543.5 + 1.5" ), 24103)
	test.strictEqual(Calculator.compute( "38 +- 14 + 91 + 1 + 3 +- 2" ), 117)
	test.done()
}

export function substraction(test) {
	test.expect(5)
	test.strictEqual(Calculator.compute( "0 - 1" ), -1)
	test.strictEqual(Calculator.compute( "1 - 1 - 13243" ), -13243)
	test.strictEqual(Calculator.compute( "51 - 111 - 5 - 1000 - 2" ), -1067)
	test.strictEqual(Calculator.compute( "234 - 324 - 23543.5 - 1.5" ), -23635)
	test.strictEqual(Calculator.compute( "-25 - 25 - 0 - -120 - 9" ), 61)
	test.done()
}

export function division(test) {
	test.expect(4)
	test.strictEqual(Calculator.compute( "0 / 1" ), 0)
	test.ok(isNaN(Calculator.compute( "0 / 0" )))
	test.strictEqual(Calculator.compute( "-25 / 25 / 0 / -0 / 9" ), Infinity)
	test.strictEqual(Calculator.compute( "51 / 111 / 5 / 1000 / 2" ), 0.00004594594594594595)
	test.done()
}

export function multiplication(test) {
	test.expect(5)
	test.strictEqual(Calculator.compute( "0 * 1" ), 0)
	test.strictEqual(Calculator.compute( "2 * + 150" ), 300)
	test.strictEqual(Calculator.compute( "5 * - 180" ), -900)
	test.strictEqual(Calculator.compute( "51 * 111 * 5 * 1000 * 2" ), 56610000)
	test.strictEqual(Calculator.compute( "3 * 111.5" ), 334.5)
	test.done()
}

export function modulo(test) {
	test.expect(7)
	test.strictEqual(Calculator.compute( "0 % 1" ), 0)
	test.strictEqual(Calculator.compute( "0 % + 121" ), 0)
	test.strictEqual(Calculator.compute( "0 % - 990" ), 0)
	test.strictEqual(Calculator.compute( "23 % 12 % 511" ), 11)
	test.strictEqual(Calculator.compute( "5 % 1555 % 555" ), 5)
	test.ok(isNaN(Calculator.compute( "1 % 0" )))
	test.strictEqual(Calculator.compute( "3 % 111.5" ), 3)
	test.done()
}

export function order(test) {
	test.expect(3)
	test.strictEqual(Calculator.compute( "5 + 5 * 2" ), 15)
	test.strictEqual(Calculator.compute( "5 - 1 / 2" ), 4.5)
	test.strictEqual(Calculator.compute( "990 - 7 % 10" ), 983)
	test.done()
}

export function parentheses(test) {
	test.expect(3)
	test.strictEqual(Calculator.compute( "38 +- 14 + (91 + 1) + 3 +- 2" ), 117)
	test.strictEqual(Calculator.compute( "234 - (324 - 23543.5) - 1.5" ), 23452)
	test.strictEqual(Calculator.compute( "51 / 111 / (5 / 1000) / 2" ), 45.94594594594595)
	test.done()
}

export function multipleParentheses(test) {
	test.expect(3)
	test.strictEqual(Calculator.compute( "122 * (54534 * 5) * 1 * (2 * 4)" ), 266125920)
	test.strictEqual(Calculator.compute( "122 * (525.34 / 5) % 1 * (2 + 4)" ), 1.7760000000125729)
	test.strictEqual(Calculator.compute( "122 * (54534 * 5) / 6.5 * (2 - 4)" ), -10235612.307692308)
	test.done()
}

export function nestedParentheses(test) {
	test.expect(7)
	test.strictEqual(Calculator.compute( "51 * 111 * (5 * 1000 * (5 * 5)) * 2" ), 1415250000)
	test.strictEqual(Calculator.compute( "51 * 111 * (5 * -1000 * (5 * 5)) * 2" ), -1415250000)
	test.strictEqual(Calculator.compute( "51 * 111 * (5 * 1000.231243 * (5 * 5))" ), 707788633.327875)
	test.strictEqual(Calculator.compute( "5 + (5 * (2 * 2.432423 / (5 * 2)))" ),  7.432423)
	test.strictEqual(Calculator.compute( "(2 * (5 + (5 * (2 * 2.432423 / (5 * 2)))))" ), 14.864846)
	test.strictEqual(Calculator.compute( "51 * 111 * (5 * 1000.231243 * (5 * 5)) * (2 * (5 + (5 * (2 * 2.432423 / (5 * 2)))))" ), 10521169034.96933)
	test.strictEqual(Calculator.compute( "511 % (111 % 5)" ), 0)
	test.done()
}