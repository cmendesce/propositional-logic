'use strict'

var exports = module.exports = { }

const token = require('../app/token.js')
		, tokenizer = require('../app/tokenizer.js')
		, tokenType = require('../app/tokenType.js').Type
		, astType = require('../app/astType.js').AstType

exports.get = get

function get(expression) {
	const tokens = tokenizer.get(expression)
	let _current = 0
	let last

	while (_current < tokens.length) {
		last = _identify(tokens[_current])
		_current++
	}

	return last

	function _identify(tokenItem) {
		switch(tokenItem.type) {
			case tokenType.PREMISE:
				return {
					type: astType.PROP,
					token: tokenItem
				}
			case tokenType.NOT:
				return {
					type: astType.UNARY,
					token: tokenItem,
					children: [_identify(tokens[++_current])]
				}
			case tokenType.OR:
			case tokenType.AND:
			case tokenType.IMPLIES:
				let node = {
					type: astType.BINARY,
					token: tokenItem,
					children: [last]
				}
				node.children.push(_identify(tokens[++_current]))
				return node
			case tokenType.OPEN:
				let nodeOpen
					, currentNode = _identify(tokens[++_current])
				while (currentNode !== null) {
					nodeOpen = currentNode
					last = currentNode
					currentNode = _identify(tokens[++_current])
				}
				return nodeOpen
			case tokenType.CLOSE:
				return null;
		}
	}
}
