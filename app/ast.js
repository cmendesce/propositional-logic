'use strict'

var exports = module.exports = { }

const token = require('../app/token'),
	tokenizer = require('../app/tokenizer'),
	tokenType = require('../app/tokenType').Type,
	astType = require('../app/astType').AstType

const stringify = (root) => {
	
	if (has(root.children)) {
		if (root.type === astType.UNARY) {
			if (root.children[0].type === astType.PROP) {
				return root.token.value + root.children[0].token.value 
			}
		} else {
			const a = root.children[0]
			const b = root.children[1]
			return `(${stringify(a)}${root.token.value}${stringify(b)})`
		}
	} else {
		return root.token.value
	}
}

const has = (children) => !!children && children.length > 0

const get = (expression) => {
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

module.exports = {
	get: get, 
	stringify: stringify
}
