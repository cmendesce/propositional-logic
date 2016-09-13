'use strict'

var exports = module.exports = { }

const token = require('../app/token.js')
		, tokenizer = require('../app/tokenizer.js')

const ASTType = {
	PROP: "PROP",
	UNARY: "UNARY",
	BINARY: "BINARY"
}

exports.syntaxTree = syntaxTree

function syntaxTree(exp) {
  const tokens = tokenizer.get(exp)
	var _current = 0;
	var last = undefined;

	while (_current < tokens.length) {
		var t = tokens[_current]
		last = identify(t)
		_current++
	}

	return last

	function identify(tokenItem) {
		switch(tokenItem.type) {
			case token.Type.PREMISE:
				return {
					type: ASTType.PROP,
					token: tokenItem
				}
			case token.Type.NOT:
				return {
					type: ASTType.UNARY,
					token: tokenItem,
					children: [identify(tokens[++_current])]
				}
			case token.Type.OR:
			case token.Type.AND:
			case token.Type.IMPLIES:
				let node = {
					type: ASTType.BINARY,
					token: tokenItem,
					children: [last]
				}
				node.children.push(identify(tokens[++_current]))
				return node
			case token.Type.OPEN:
				let nodeOpen
					, currentNode = identify(tokens[++_current])
				while (currentNode !== null) {
					nodeOpen = currentNode
					last = currentNode
					currentNode = identify(tokens[++_current])
				}
				return nodeOpen
			case token.Type.CLOSE:
				return null;
		}
	}
}
