'use strict'

describe('Resolution: ', () => {
  const proof = require('../app/resolution/proof'),
    ast = require('../app/ast').get

  describe('Simple proof', () => {
    it('(A) ⊢ (A)', () => {
      expect(proof('(A)', ['(A)']).solved).toBeTruthy()
    })

    it('(A) ⊢ ~(~A)', () => {
      expect(proof('(A)', ['~(~A)'])).toBeTruthy()
    })

    it('(~A) ⊢ (~A)', () => {
      expect(proof('(~A)', ['(~A)']).solved).toBeTruthy()
    })

    it('~(~A) ⊢ (A)', () => {
      expect(proof('~(~A)', ['(A)']).solved).toBeTruthy()
    })
  })

  it('empty', () => {
    expect(proof('~(~A)', []).resolvents).toEqual([])
  })
  it('undefined', () => {
    expect(proof('~(~A)', undefined)).toBe(null)
  })

  describe('Proof without resolvents', () => {
    it('{(A ^ B) ⊢ {(A), (B), (~B)}', () => {
      expect(proof('(A ^ B)', ['(A)', '(B)', '(~B)']).solved).toBeTruthy()
    })

    it('{(A ^ B) ⊢ {(A), (B), (~B), (A v B)}', () => {
      expect(proof('(A ^ B)', ['(A v B)', '(A)', '(B)', '(~B)']).solved).toBeTruthy()
    })
  })
  
})

const log = msg => console.dir(msg, {depth: null, colors: true})