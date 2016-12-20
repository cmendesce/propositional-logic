'use strict'

describe('Resolution: ', () => {
  const resolution = require('../app/resolution/resolution'),
    ast = require('../app/ast').get,
    cnf = require('../app/cnf').convert

  describe('isLiteral', () => {
    it('Opposite polarity', () => {
      expect(resolution.isLiteral(ast('(A)'), ast('~(A)'))).toBeTruthy()
    })

    it('Same polarity', () => {
      expect(resolution.isLiteral(ast('(A)'), ast('(A)'))).toBeTruthy()
      expect(resolution.isLiteral(ast('~(A)'), ast('~(A)'))).toBeTruthy()
    })
  })

  describe('isComplementary', () => {
    it('Opposite polarity', () => {
      const not = { type: 'UNARY',
            token: { type: 'NOT', value: '~' },
            children: [ { type: 'PROP', token: { type: 'PREMISE', value: 'A' } } ] }
            
       const a = { type: 'PROP', token: { type: 'PREMISE', value: 'A' } }

      expect(resolution.isComplementary(a, not)).toBeTruthy()
    })
  })
})