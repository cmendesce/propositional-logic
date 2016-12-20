'use strict'

const r = f => require('../../app/' + f)

const tokenType = r('tokenType').Type, 
	h = r('helper')

const generateClauses = (formula) => {
	let _clauses = []

	if (isClause(formula)) {
		_clauses.push(formula)
	} else {
		if (h.has(formula.children)) {
			_clauses = _clauses.concat(generateClauses(formula.children[0])).concat(generateClauses(formula.children[1]))
		}
	}
	
	return _clauses
}

const isClause = p => h.is(p, tokenType.OR) || isLiteral(p)

const isLiteral = p => 
	h.is(p, tokenType.PREMISE) || (h.is(p, tokenType.NOT) && h.is(p.children[0], tokenType.PREMISE))


const isComplementary = (p1, p2) => {

	if (!p1 || !p2) return false
	
	if (h.is(p1, tokenType.NOT) && h.is(p2, tokenType.PREMISE)) {
		return p1.children[0].token.value === p2.token.value
	}

	if (h.is(p1, tokenType.PREMISE) && h.is(p2, tokenType.NOT)) {
		return p1.token.value === p2.children[0].token.value
	}
	return false
}

const literalEquals = (a, b) => {
	if (!a || !b) return false

	return isLiteral(a) && isLiteral(b) && a.token.value === b.token.value
}

module.exports = {
	isComplementary: isComplementary,
	isLiteral: isLiteral,
	isClause: isClause,
	generateClauses: generateClauses,
	literalEquals: literalEquals
}