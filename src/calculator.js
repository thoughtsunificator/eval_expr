import * as Parser from './parser.js'

const STATE_AWAITING_OPERATOR = "AWAITING_OPERATOR" // We have an operand what we need is an operator
const STATE_AWAITING_OPERAND = "AWAITING_OPERAND" // We have the operator what we need is a second operand
const STATE_AWAITING_EQUAL = "AWAITING_EQUAL" // We have the second operand; operation is ready to be computed
const STATE_EQUAL = "EQUAL" // Operation was computed we are displaying the output of it and will be starting a new operation

/**
 * @param {string} str
 * returns {string}
 */
export function compute(str) {
	const tokens = Parser.parse(str)
	let state = STATE_AWAITING_OPERAND
	let output = null
	let operand = null
	let operator = null
	// console.log("state ", state)
	for(const token of tokens) {
		// console.log("input ", token.buffer)
		if((state === STATE_AWAITING_OPERAND || state === STATE_EQUAL) && token.name === "operand") {
			if(output === null && token.name === "operand") {
				output = token.buffer
			} else if(token.name === "operand") {
				operand = token.buffer
			}
			if(operand === null) {
				state = STATE_AWAITING_OPERATOR
			} else {
				state = STATE_AWAITING_EQUAL
			}
		} else if((state === STATE_AWAITING_OPERATOR || state === STATE_EQUAL) && token.name === "operator") {
			operator = token.buffer
			state = STATE_AWAITING_OPERAND
		}

		if(state === STATE_AWAITING_EQUAL) {
			// console.log(`computing  ${output} ${operator} ${operand}`)
			if (operator === "%") {
				output %= operand
			} else if (operator === "/") {
				output /= operand
			} else if (operator === "-") {
				output -= operand
			} else if (operator === "*") {
				output *= operand
			} else if (operator === "+") {
				output += operand
			}
			// console.log(`result  ${output}`)
			state = STATE_EQUAL
		}
		// console.log("state ", state)
	}
	return output
}

