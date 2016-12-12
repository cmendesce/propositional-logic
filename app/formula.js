'use strict'

const tokenType = require('../app/tokenType').Type
const astType = require('../app/astType').AstType

const not = (exp) => {
	return {
		type: astType.UNARY,
		token: {type: tokenType.NOT, value: '~'},
		children: [exp]
	}
}

const or = (left, right) => {
	return {
		type: astType.BINARY,
    token: {type: tokenType.OR, value: 'v'},
    children: [left, right]
	};
}

const and = (left, right) => {
	return {
		type: astType.BINARY,
    token: {type: tokenType.AND, value: '^'},
    children: [left, right]
	}
}

const implies = (left, right) => {
	return {
		type: astType.BINARY,
    token: {type: tokenType.IMPLIES, value: '->'},
    children: [left, right]
	}
}

module.exports = {
	implies: implies,
	and: and,
	or: or, 
	not: not
}