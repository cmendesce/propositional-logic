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
*/

'use strict'  

describe('CNF: ', () => {
  const token = require('../app/token')
  const tokenType = require('../app/tokenType').Type
  const astType = require('../app/astType').AstType
  const cnf = require('../app/cnf')
  const ast = require('../app/ast')

  

  describe('Basic', () => {
    
    it('P should be P', () => {
      const expected = {
        type: astType.PROP,
        token: {type: tokenType.PREMISE, value: 'P'}
      }
      expect(cnf.convert('(P)')).toEqual(expected)
    })

    it('(~P) should be (~P)', () => {
      const expected = {
        type: astType.UNARY,
        token: {type: tokenType.NOT, value: '~'},
        children: [
          { type: astType.PROP,
            token: {type: tokenType.PREMISE, value: 'P'}
          }
        ]
      }
      expect(cnf.convert('(~P)')).toEqual(expected)
    })
  })

  describe('Remove implies', () => {
    it('(A -> B) should be ((~A) v B)', () => {
      expect(cnf.convert('(A -> B)')).toEqual(ast.get('(~A v B)'))
    })

    it('((A v C ^ D) -> (B ^ A)) should be (~(A v C ^ D) v (B ^ A))', () => {
      expect(cnf.convert('(A -> B)')).toEqual(ast.get('(~A v B)'))
    })

    it('(~(A -> B)) should be (A ^ ~B)', () => {
      expect(cnf.convert('~(A -> B)')).toEqual(ast.get('(A ^ ~B)'))
    })
  })

  describe('Fix negations', () => {
    it('~(~A) should be A', () => {
      expect(cnf.convert('~(~A)')).toEqual(ast.get('A'))
    })

    it('~(A ^ B) should be (~A v ~B)', () => {
      expect(cnf.convert('~(A ^ B)')).toEqual(ast.get('(~A v ~B)'))
    })

    it('~(A v B) should be (~A ^ ~B)', () => {
      expect(cnf.convert('~(A v B)')).toEqual(ast.get('(~A ^ ~B)'))
    })
  })
})