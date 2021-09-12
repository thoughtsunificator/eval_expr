import * as Tokenizer from './tokenizer.js'

/**
 * @param {string} str
 * returns {Object[]}
 */
export function tokenize(str) {
	let tokens = Tokenizer.tokenize(str)

	const openedTokens = []
	const matchedTokens = []
	let groupId = 1

	for (const token of tokens) {
		if (token.name === "left parenthesis") {
			openedTokens.push(token)
		} else if (token.name === "right parenthesis") {
			if (openedTokens.length >= 1) {
				matchedTokens.push({
					name: "group",
					bufferIndex: openedTokens[openedTokens.length -1].bufferIndex,
					openingParenthesis: openedTokens[openedTokens.length -1],
					closingParenthesis: token,
					groupId
				})
				groupId++
				openedTokens.splice(openedTokens.length -1, 1)
			} else {
				token.name = "operand"
			}
		}
	}
	for(const token of openedTokens) {
		token.name = "operand"
	}
	// Merge consecutives operand tokens
	let mergedTextToken = null
	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i].name === "operand") {
			if (mergedTextToken === null) {
				mergedTextToken = tokens[i]
			} else {
				mergedTextToken.buffer += tokens[i].buffer
				tokens.splice(i, 1)
				i--
			}
		} else {
			mergedTextToken = null
		}
	}
		// Transform consecutives operators
	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i].name === "operator") {
			if((i === 0 && tokens[i].name === "operator") || tokens[i - 1].name === "operator") {
				tokens[i + 1].buffer = tokens[i].buffer + tokens[i + 1].buffer
				tokens.splice(i, 1)
				i--
			}
		}
	}
	tokens = tokens.filter(token => token.name !== "right parenthesis" && token.name !== "left parenthesis")

	tokens.sort((a, b) => a.bufferIndex - b.bufferIndex)
		// associate parents and childs
	tokens.forEach(function(token) {
		const parents = matchedTokens.filter(function(token_) {
			if (token_.name === "group"
			&& token_ !== token
			&& token.bufferIndex > token_.bufferIndex
			&& token.bufferIndex < token_.closingParenthesis.bufferIndex) {
				return true
			}
		})
		if (parents.length >= 1) {
			const parent = parents[0]
			if(parent.hasOwnProperty("children") === false) {
				parent.children = []
			}
			parent.children.push(token)
			// token.parents = parents
			// token.parent = parents[parents.length - 1]}
			token.groupId = parent.groupId
		}
	})
	tokens = tokens.map(token => {
		if(token.name === "operand") {
			return {...token, buffer: parseFloat(token.buffer)}
		} else {
			return token
		}
	})
	return tokens
}

/**
 * Build an operation out of a series of token
 * @param  {string} 	str 	The input text
 * @return {Object[]}     	An array of bbcode objects
 */
export function parse(str) {
	let tokens = tokenize(str)
	const map = new Map()
	tokens.filter(token => token.groupId).forEach((item) => {
		const key = item.groupId
		const collection = map.get(key)
		if (!collection) {
			map.set(key, [item])
		} else {
			collection.push(item)
		}
	})
	for(const [groupId, groupTokens] of map) {
		let operandTokens = groupTokens.filter(token => token.name === "operand")
		let operatorToken = groupTokens.filter(token => token.name === "operator")[0]
		if(operandTokens.length === 1) {
			continue
		}
		let token = { ...operandTokens[0] }
		if (operatorToken.buffer === "%") {
			token.buffer = operandTokens[0].buffer % operandTokens[1].buffer
		} else if (operatorToken.buffer === "/") {
			token.buffer = operandTokens[0].buffer / operandTokens[1].buffer
		} else if (operatorToken.buffer === "-") {
			token.buffer = operandTokens[0].buffer - operandTokens[1].buffer
		} else if (operatorToken.buffer === "*") {
			token.buffer = operandTokens[0].buffer * operandTokens[1].buffer
		} else if (operatorToken.buffer === "+") {
			token.buffer = operandTokens[0].buffer + operandTokens[1].buffer
		}
		tokens.splice(tokens.indexOf(operandTokens[0]), 3, token)
	}
	tokens.forEach(token => {
		delete token.groupId
		delete token.bufferIndex
	})
	return tokens
}

