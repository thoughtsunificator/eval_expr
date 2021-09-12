const CHARACTERS_OPERAND = "0123456789.-"
const CHARACTERS_OPERATOR = "+-/*%"

/**
 * @param  {string} str
 * @return {array}
 */
export function tokenize(str) {
	const characters = [...str]
	let buffer = ""
	let tokens = []

	for(const [index, character] of characters.entries()) {
		if(character === " ") {
			continue
		}
		buffer += character
		const bufferIndex = index - buffer.length + 1
		if(buffer[0] === "(") {
			tokens.push({ name: "left parenthesis", buffer, bufferIndex })
			buffer = ""
		} else if(buffer[0] === ")") {
			tokens.push({ name: "right parenthesis", buffer, bufferIndex })
			buffer = ""
		} else if(CHARACTERS_OPERATOR.includes(buffer[0])) {
			tokens.push({ name: "operator", buffer, bufferIndex })
			buffer = ""
		} else if(CHARACTERS_OPERAND.includes(buffer[0])) {
			tokens.push({ name: "operand", buffer, bufferIndex })
			buffer = ""
		}
	}

	return tokens
}
