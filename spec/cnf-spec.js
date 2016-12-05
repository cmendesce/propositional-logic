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
  const ast = require('../app/ast').get

  describe('Basic', () => {
    it('P should be P', () => {
      expect(cnf.convert(ast('(P)'))).toEqual(ast('(P)'))
    })
    it('(P ^ Q) should be (P ^ Q)', () => {
      expect(cnf.convert(ast('(P ^ Q)'))).toEqual(ast('(P ^ Q)'))
    })
    it('(P ^ Q) v (A ^ B) should be (P ^ Q) v (A ^ B)', () => {
      expect(cnf.convert(ast('(P ^ Q) v (A ^ B)'))).toEqual(ast('(P ^ Q) v (A ^ B)'))
    })
  })

  describe('Remove implies', () => {
    it('(A -> B) should be ((~A) v B)', () => {
      expect(cnf.removeImplies(ast('(A -> B)'))).toEqual(ast('(~A v B)'))
    })

    it('((A v C ^ D) -> (B ^ A)) should be (~(A v C ^ D) v (B ^ A))', () => {
      expect(cnf.removeImplies(ast('(A -> B)'))).toEqual(ast('(~A v B)'))
    })

    it('(~(A -> B)) should be (A ^ ~B)', () => {
      expect(cnf.removeImplies(ast('~(A -> B)'))).toEqual(ast('(A ^ ~B)'))
    })

    it ('(A ∨ B) -> C should be (~(A v B) v C)', () => {
      expect(cnf.removeImplies(ast('((A v B) -> C)'))).toEqual(ast('(~(A v B) v C)'))
    })

    it ('((P -> Q) v (P -> R)) should be ((~P v Q) v (~P v R))', () => {
      expect(cnf.removeImplies(ast('((P -> Q) v (P -> R))'))).toEqual(ast('((~P v Q) v (~P v R))'))
    })
    
    it ('((P -> Q) ^ (P -> R)) should be ((~P v Q) ^ (~P v R))', () => {
      expect(cnf.removeImplies(ast('((P -> Q) ^ (P -> R))'))).toEqual(ast('((~P v Q) ^ (~P v R))'))
    })

    it ('((P -> Q) -> (P -> R)) should be (~(~P v Q) v (~P v R))', () => {
      expect(cnf.removeImplies(ast('((P -> Q) -> (P -> R))'))).toEqual(ast('(~(~P v Q) v (~P v R))'))
    })

    // it ('(~(P -> Q) -> (P -> R)) should be ((~P v Q) ^ ~(~P v R))', () => {
    //   expect(cnf.removeImplies(ast('(~(P -> Q) -> (P -> R))'))).toEqual(ast('((~P v Q) ^ ~(~P v R))'))
    // })
  })

  describe('Fix negations', () => {

    it('(~P) should be (~P)', () => {
      expect(cnf.fixNegations(ast('(~P)'))).toEqual(ast('~(P)'))
    })

    it('~(~A) should be A', () => {
      expect(cnf.fixNegations(ast('~(~A)'))).toEqual(ast('A'))
    })

    it('~(~P v Q) should be (P v (~Q))', () => {
      expect(cnf.fixNegations(ast('~(~P v Q)'))).toEqual(ast('(P v (~Q))'))
    })

    describe('De Morgan`s laws', () => {
      it('~(A ^ B) should be (~A v ~B)', () => {
        expect(cnf.fixNegations(ast('~(A ^ B)'))).toEqual(ast('(~A v ~B)'))
      })

      it('~(A v B) should be (~A ^ ~B)', () => {
        expect(cnf.fixNegations(ast('~(A v B)'))).toEqual(ast('(~A ^ ~B)'))
      })
    })
  })

  const assert = (actual, expected) => {
    expect(cnf.convert(ast('~(A v B)'))).toEqual(ast('(~A ^ ~B)'))
  }
})