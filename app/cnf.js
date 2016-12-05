'use strict'


const token = require('../app/token'), 
	tokenType = require('../app/tokenType').Type, 
	ast = require('../app/ast.js'), 
	astType = require('../app/astType').AstType,
	formula = require('../app/formula'),
	or = formula.or, 
	and = formula.and,
	not = formula.not;

const convert = (exp) => {
	const root = ast.get(exp)

	const noImplies = removeImplies(exp);
	const fixedNegations = fixNegations(noImplies);
	
	return fixedNegations;
};

//passo 1 
const removeImplies = (root) => {
	if (!root) return root;

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

	if (root.type === astType.UNARY) {
		if (has(root.children) && root.children.length == 1) {
			const child = root.children[0];

			if (child.token.type === tokenType.NOT) { //¬¬α ≡ α
				return child.children[0];
			}

			if (child.type === astType.BINARY && 
				child.children[0].token.type === tokenType.NOT) { // ~(~P x Q)
					const a = child.children[0].children[0]
					const b = child.children[1]
					let conector = child.type === astType.AND ? and : or
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
	}

	return root;
};

const has = (children) => !!children && children.length > 0

module.exports = {
	convert: convert,
	removeImplies: removeImplies, 
	fixNegations: fixNegations
}

/*
passo1: elimine o conectivo → usando: 
α → β ≡ (¬α ∨ β)
¬(α → β) ≡ (α ∧ ¬β)

passo 2: mova a negação (¬) para o interior da fórmula, usando as seguintes regras: ¬¬α ≡ α
¬(α ∧ β) ≡ (¬α ∨ ¬β)
¬(α ∨ β) ≡ (¬α ∧ ¬β)

passo3: mova as conjunções para o exterior da fórmula usando:
α ∨ (β ∧ γ) ≡ (α ∨ β) ∧ (α ∨ γ)
(α ∧ β) ∨ γ ≡ (α ∨ γ) ∧ (β ∨ γ)


Exemplo:
(A∨B)→C⇒ passo1 ⇒¬(A∨B)∨C⇒ passo2 ⇒ (¬A∧¬B)∨C ⇒ passo3 ⇒(¬A∨C)∧(¬B∨C)FNC
*/