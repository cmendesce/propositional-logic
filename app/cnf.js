'use strict'


const token = require('../app/token'), 
	tokenType = require('../app/tokenType').Type, 
	ast = require('../app/ast'), 
	astType = require('../app/astType').AstType,
	formula = require('../app/formula'),
	or = formula.or, 
	and = formula.and,
	prop = formula.prop,
	not = formula.not;

const convert = (exp) => {
	if (!exp) return null

	const root = ast.get(exp)
	
	const step1 = removeImplies(root)
	const step2 = fixNegations(step1)
	const step3 = distribute(step2)

	return {
		steps: [step1, step2, step3],
		tree: step3,
		expression: ast.stringify(step3)
	}
}

//passo 1 
const removeImplies = (root) => {
	if (!root) return null;

	if (root.type === astType.BINARY) {		
		if (root.token.type === tokenType.IMPLIES) {
			const a = removeImplies(root.children[0])
			const b = removeImplies(root.children[1])
			return or(not(a), b)

		} else {
			root.children[0] = removeImplies(root.children[0])
			root.children[1] = removeImplies(root.children[1])
			return root
		}
	} else {
		if (has(root.children) && root.token.type === tokenType.NOT) { // ~(A -> B)
			const nodeNot = root.children[0]
			if (nodeNot.token.type === tokenType.IMPLIES) {

				const a = removeImplies(nodeNot.children[0])
				const b = removeImplies(nodeNot.children[1])
				return and(a, not(b))

			} else if (has(nodeNot.children)) { 
				nodeNot.children[0] = removeImplies(nodeNot.children[0])
				nodeNot.children[1] = removeImplies(nodeNot.children[1])
				root.children[0] = nodeNot
				return root
			}
		}
		return root;
	}
}

// passo 2
const fixNegations = (root) => {

	if (!root) return null

	if (root.type === astType.UNARY) {
		if (has(root.children) && root.children.length == 1) {
			const child = root.children[0]

			if (child.token.type === tokenType.NOT) { //¬¬α ≡ α
				return child.children[0];
			}

			if (child.type === astType.BINARY && 
				child.children[0].token.type === tokenType.NOT) { // ~(~P x Q)
					const a = child.children[0].children[0]
					const b = child.children[1]
					const conector = child.token.type === tokenType.AND ? or : and
					return conector(a, not(b))
			}

			if (child.token.type === tokenType.AND) { // ¬(α ∧ β) ≡ (¬α ∨ ¬β)
				const left = child.children[0]
				const right = child.children[1]
				return or(not(left), not(right))
			}

			if (child.token.type === tokenType.OR) { // ¬(α ∨ β) ≡ (¬α ∧ ¬β)
			 	const left = child.children[0]
			 	const right = child.children[1]
				return and(not(left), not(right))
			}
		}
	} else if (has(root.children)) {
		if (root.children[0].token.type === tokenType.NOT && 
			root.children[0].children[0].type === astType.BINARY) {
			root.children[0] = fixNegations(root.children[0])
		}
		
		if (root.children.length === 2 &&
			root.children[1].token.type === tokenType.NOT && 
			root.children[1].children[0].type === astType.BINARY) {	
			root.children[1] = fixNegations(root.children[1])
		}
		return root
	}

	return root
}

const rebuild = (root, p) => {

	if (!root) return null
	
	if (has(root.children)) {

		for (let i=0; i <= root.children.length; i++) {
			
			if (!!root.children[i]) {
				if (root.children[i].token.value === 'TEMP') {
					root.children[i] = p
				} else {
					root.children[i] = rebuild(root.children[i], p)
				}
			}
		}
		
	}
	return root
}

const distribute = root => {
  
	//   ((A ^ B) v (C ^ D))
	//   ((A v C) ^ (B v C) ^ (A v D) ^ (B v D))
	if (!root) return null

	if (is(root, tokenType.OR)) {

		if (is(root.children[0], tokenType.AND) && is(root.children[1], tokenType.AND)) {

			const p = root.children[0] // P = (A ^ B)
			const temp = distribute(or(prop('TEMP'), root.children[1])) // (P v C) ^ (P v D)
			
			const left = temp.children[0] // (P v C)
			const right = temp.children[1] // (P v D)
			left.children[0] = p // (A ^ B) v C
			right.children[0] = p // (A ^ B) v D

			return and(distribute(left), distribute(right))
		}

		if (is(root.children[1], tokenType.AND)) { // A v (B ^ C) <--> (A v B) ^ (A v C)

			const a = distribute(root.children[0])
			const b = distribute(root.children[1].children[0])
			const c = distribute(root.children[1].children[1])

			return distribute(and(or(a, b), or(a, c)))
		}

		if (is(root.children[0], tokenType.AND)) { // (A ^ B) v C <--> (A v C) ^ (B v C)
				const a = distribute(root.children[0].children[0])
				const b = distribute(root.children[0].children[1])
				const c = distribute(root.children[1])
				
				return distribute(and(or(a, c), or(b, c)))
		}
	}

	return root
}

const has = children => !!children && children.length > 0

const is = (root, tType) => root.token.type === tType

module.exports = {
	convert: convert,
	removeImplies: removeImplies, 
	fixNegations: fixNegations,
	distribute: distribute
}