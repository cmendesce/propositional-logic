'use strict'

describe('CNF: ', () => {
  const token = require('../app/token')
  const tokenType = require('../app/tokenType').Type
  const astType = require('../app/astType').AstType
  const cnf = require('../app/cnf')
  const ast = require('../app/ast').get

  describe('Basic', () => {
    it('P should be P', () => {
      expect(cnf.convert('(P)')).toEqual(ast('(P)'))
    })
    it('(P ^ Q) should be (P ^ Q)', () => {
      expect(cnf.convert('(P ^ Q)')).toEqual(ast('(P ^ Q)'))
    })
    it('(P ^ Q) v (A ^ B) should be (P ^ Q) v (A ^ B)', () => {
      expect(cnf.convert('(P ^ Q) v (A ^ B)')).toEqual(ast('(P ^ Q) v (A ^ B)'))
    })

    it('null', () => {
      expect(cnf.convert(undefined)).toBeNull()
      expect(cnf.removeImplies(undefined)).toBeNull()
      expect(cnf.fixNegations(undefined)).toBeNull()
      expect(cnf.distribute(undefined)).toBeNull()
    })

    it('((A ∨ B) -> C) should be ((~A v C) ^ (~B ∨ C))', () => {
      expect(cnf.convert('((A v B) -> C)')).toEqual(ast('((~A v C) ^ (~B v C))'))
    })

    // it('(((P -> Q) -> P) -> P) should be (((~P v Q) ^ ~P) v P)', () => {
      // expect(cnf.convert('(((P -> Q) -> P) -> P)')).toEqual(ast('(((~P v Q) ^ ~P) v P)'))
    // })
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
  })

  describe('Fix negations', () => {

    it('(~P) should be (~P)', () => {
      expect(cnf.fixNegations(ast('(~P)'))).toEqual(ast('~(P)'))
    })

    it('~(~A) should be A', () => {
      expect(cnf.fixNegations(ast('~(~A)'))).toEqual(ast('A'))
    })

    it('~(~P v Q) should be (P ^ (~Q))', () => {
      expect(cnf.fixNegations(ast('~(~P v Q)'))).toEqual(ast('(P ^ (~Q))'))
    })

    it('~(~P ^ Q) should be (P v (~Q))', () => {
      expect(cnf.fixNegations(ast('~(~P ^ Q)'))).toEqual(ast('(P v (~Q))'))
    })

    it('(~(A v B) v C) should be ((~A ^ ~B) v C)', () => {
      expect(cnf.fixNegations(ast('(~(A v B) v C)'))).toEqual(ast('((~A ^ ~B) v C)'))
    })

    it('(~(A v B) v ~(P v Q)) should be ((~A ^ ~B) v (~P ^ ~Q))', () => {
      expect(cnf.fixNegations(ast('(~(A v B) v ~(P v Q))'))).toEqual(ast('((~A ^ ~B) v (~P ^ ~Q))'))
    })

    // it('~(A v B v C ^ D) should be ', () => {
    //   expect(cnf.fixNegations(ast('~(A v B v C ^ D)'))).toEqual(ast('(~A ^ ~B v ~C v ~D)'))
    // })

    // it('~A ^ ((~B ^ ~C) v (~B ^ ~D)) should be ', () => {
    //   expect(cnf.fixNegations(ast(''))).toEqual(ast(''))
    // })

    describe('De Morgan`s laws', () => {
      it('~(A ^ B) should be (~A v ~B)', () => {
        expect(cnf.fixNegations(ast('~(A ^ B)'))).toEqual(ast('(~A v ~B)'))
      })

      it('~(A v B) should be (~A ^ ~B)', () => {
        expect(cnf.fixNegations(ast('~(A v B)'))).toEqual(ast('(~A ^ ~B)'))
      })

      it('~((A v C) v (B v D)) should be (~(A v C) ^ ~(B v D))', () => {
        expect(cnf.fixNegations(ast('~((A v C) v (B v D))'))).toEqual(ast('(~(A v C) ^ ~(B v D))'))
      })

      it('~((A v C) ^ (B v D)) should be (~(A v C) v ~(B v D))', () => {
        expect(cnf.fixNegations(ast('~((A v C) ^ (B v D))'))).toEqual(ast('(~(A v C) v ~(B v D))'))
      })

      it('(~(A ^ B) v C) should be (~A v ~B) v C', () => {
        expect(cnf.fixNegations(ast('(~(A ^ B) v C)'))).toEqual(ast('(~A v ~B) v C'))
      })

      it('(~(A v B) ^ C) should be (~A ^ ~B) ^ C', () => {
        expect(cnf.fixNegations(ast('(~(A v B) ^ C)'))).toEqual(ast('(~A ^ ~B) ^ C'))
      })

      it('(~(A ^ B) ^ C) should be (~A v ~B) ^ C', () => {
        expect(cnf.fixNegations(ast('(~(A ^ B) ^ C)'))).toEqual(ast('(~A v ~B) ^ C'))
      })
    })
  })

  describe('Distribute', () => {

    it('(A v (B ^ C)) should be ((A v B) ^ (A v C))', () => {
      expect(cnf.distribute(ast('(A v (B ^ C))'))).toEqual(ast('((A v B) ^ (A v C))'))
    })

    it('((A ^ B) v C) should be ((A v C) ^ (B v C))', () => {
      expect(cnf.distribute(ast('((A ^ B) v C)'))).toEqual(ast('((A v C) ^ (B v C))'))
    })

    it('((~A ^ ~B) v C) should be ((~A v C) ^ (~B v C))', () => {
      expect(cnf.distribute(ast('((~A ^ ~B) v C)'))).toEqual(ast('((~A v C) ^ (~B v C))'))
    })
  })
})