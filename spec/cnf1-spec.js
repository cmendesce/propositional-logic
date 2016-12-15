'use strict'

describe('CNF: ', () => {
  const token = require('../app/token')
  const tokenType = require('../app/tokenType').Type
  const astType = require('../app/astType').AstType
  const cnf = require('../app/cnf.test')
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

    it('null', () => {
      expect(cnf.convert(undefined)).toBeNull()
      
    })

    it('((A ∨ B) -> C) should be ((~A v C) ^ (~B ∨ C))', () => {
      expect(cnf.convert(ast('((A v B) -> C)'))).toEqual(ast('((~A v C) ^ (~B v C))'))
    })

    
    it('(((A ∨ B) -> C) -> D) should be ((~A v C) ^ (~B ∨ C))', () => {
      expect(cnf.convert(ast('((A v B) -> C)'))).toEqual(ast('((~A v C) ^ (~B v C))'))
    })
  })
})