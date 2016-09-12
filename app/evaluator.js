'use strict'

var exports = module.exports = {}

const token = require('../app/token.js')
const tokenizer = require('../app/tokenizer.js')
const treeify = require('treeify')

var ASTType = {
	PROP: "PROP",
	UNARY: "UNARY",
	BINARY: "BINARY"
}

exports.asTree = function(exp) {
  const tokens = tokenizer.do(exp)
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
				var node = {
					type: ASTType.BINARY,
					token: tokenItem,
					children: [last]
				}
				node.children.push(identify(tokens[++_current]))
				return node
			case token.Type.OPEN:
				var loopAST = undefined;
				var t = tokens[++_current]
				var c = identify(t)
				while ( c != null ) {
					loopAST = c
					last = c
					t = tokens[++_current]
					c = identify(t)
				}
				return loopAST;
			case token.Type.CLOSE:
				return null;
		}
	}

}
