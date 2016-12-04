'use strict'


const token = require('../app/token.js')
const tokenType = require('../app/tokenType').Type
const ast = require('../app/ast.js')
const astType = require('../app/astType.js').AstType

const convert = (exp) => {
	const root = ast.get(exp)

	const noImplies = removeImplies(root);
	const fixedNegations = fixNegations(noImplies);
	
	return fixedNegations;
};

const removeImplies = (root) => {
	/*
	passo 1: elimine o conectivo → usando: 
		 α → β ≡ (¬α ∨ β)
		¬(α → β) ≡ (α ∧ ¬β)
	*/
	if (root.type === astType.BINARY) {
		const left = root.children[0]
		const right = root.children[1]

		if (root.token.type === tokenType.IMPLIES) {
				return or(not(left), right)
		}
	} else {
		if (hasChildren(root.children)) {
			
			if (root.children[0].token.type === tokenType.IMPLIES) { // ~(A x B)	
				const left = root.children[0].children[0]
				const right = root.children[0].children[1]

				return and(left, not(right));
			}
		}
		return root;
	}
}

const fixNegations = (root) => {
	/*
	passo 2: mova a negação (¬) para o interior 
		¬¬α ≡ α
		¬(α ∧ β) ≡ (¬α ∨ ¬β)
		¬(α ∨ β) ≡ (¬α ∧ ¬β)
	*/

	if (root.type === astType.UNARY) {
		 if (hasChildren(root.children) && root.children.length == 1) { //¬¬α ≡ α
			 if (root.children[0].token.type === tokenType.NOT) {
			 	return root.children[0].children[0];
			 }

			 if (root.children[0].token.type === tokenType.AND) { // ¬(α ∧ β) ≡ (¬α ∨ ¬β)
				 const left = root.children[0].children[0]
				 const right = root.children[0].children[1]
				 return or(not(left), not(right))
			 }

			 if (root.children[0].token.type === tokenType.OR) { // ¬(α ∨ β) ≡ (¬α ∧ ¬β)
				 const left = root.children[0].children[0]
				 const right = root.children[0].children[1]
				 return and(not(left), not(right))
			 }
		 }

	}


	


	return root;
};

const hasChildren = (children) => !!children && children.length > 0

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
	};
}

module.exports = {convert:convert};

//console.log(JSON.stringify(convert('(A -> B)')))



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


public static Formula fixNegations (Formula f) { //Move negations in (until we have none)
		if (f instanceof NotFormula) { //NOT
			if (((NotFormula) f).p instanceof NotFormula) { //NOT NOT
				return fixNegations(((NotFormula)((NotFormula) f).p).p);
			}
			else if (((NotFormula) f).p instanceof AndFormula) { //NOT AND
				return new OrFormula(fixNegations(new NotFormula(((AndFormula)((NotFormula) f).p).p)), fixNegations(new NotFormula(((AndFormula)((NotFormula) f).p).q)));
			}
			else if (((NotFormula) f).p instanceof OrFormula) { //NOT OR
				return new AndFormula(fixNegations(new NotFormula(((OrFormula)((NotFormula) f).p).p)), fixNegations(new NotFormula(((OrFormula)((NotFormula) f).p).q)));
			}
			else if (((NotFormula)f).p instanceof BoolFormula) { //NOT CONST
				return new BoolFormula(!((BoolFormula)((NotFormula)f).p).b);
			}
			else { //NOT VAR
				return fixNegations(((NotFormula)f).p);
			}
		}
		else if (f instanceof AndFormula) {
			return new AndFormula (fixNegations(((AndFormula)f).p), fixNegations(((AndFormula)f).q));
		}
		else if (f instanceof OrFormula) {
			return new OrFormula (fixNegations(((OrFormula)f).p), fixNegations(((OrFormula)f).q));
		}
		else { // VAR or CONST
			return f;
		}
	}*/