'use strict'


const token = require('../app/token'), 
	tokenType = require('../app/tokenType').Type, 
	ast = require('../app/ast').get, 
	astType = require('../app/astType').AstType,
	formula = require('../app/formula'),
	or = formula.or, 
	and = formula.and,
	not = formula.not;

const convert = (exp) => {
	if (!exp) return null

	const root = ast(exp)
	
	const step1 = removeImplies(root)
	const step2 = fixNegations(step1)
	const step3 = distribute(step2)

	return step3
};

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
};

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
};

const distribute = (root) => {
	if (!root) return null

	if (root.token.type === tokenType.OR) {
		const a = root.children[0]
		const b = root.children[1]

		if (a.type === astType.PROP && b.token.type === tokenType.AND) { // * v (P ^ Q)
			const conjunction = b.children
			return and(or(a, conjunction[0]), or(a, conjunction[1]))
		} else if (a.token.type === tokenType.AND && b.type === astType.PROP) {
			const conjunction = a.children
			return and(or(conjunction[0], b), or(conjunction[1], b))
		}
	}
	
	return root;
}

const has = (children) => !!children && children.length > 0

module.exports = {
	convert: convert,
	removeImplies: removeImplies, 
	fixNegations: fixNegations,
	distribute: distribute
}

/*
passo1: elimine o conectivo → usando: 
α → β ≡ (¬α ∨ β)
¬(α → β) ≡ (α ∧ ¬β)

passo 2: mova a negação (¬) para o interior da fórmula, usando as seguintes regras: 
¬¬α ≡ α
¬(α ∧ β) ≡ (¬α ∨ ¬β)
¬(α ∨ β) ≡ (¬α ∧ ¬β)

passo3: mova as conjunções para o exterior da fórmula usando:
α ∨ (β ∧ γ) ≡ (α ∨ β) ∧ (α ∨ γ)
(α ∧ β) ∨ γ ≡ (α ∨ γ) ∧ (β ∨ γ)

Exemplo:
(A∨B)→C⇒ passo1 ⇒¬(A∨B)∨C⇒ passo2 ⇒ (¬A∧¬B)∨C ⇒ passo3 ⇒(¬A∨C)∧(¬B∨C)FNC
*/