'use strict'

describe('AST: ', () => {
  const ast = require('../app/ast')
  const testData = require('../spec/ast-test-data.js')
  describe('should get abstract syntax tree from a', () => {
    
    it('simple expressions', function() {
      for (const exp in testData.simple) {
        const result = testData.simple[exp]
        expect(ast.get(exp)).toEqual(result)
      }
    })

    it('two premise expressions', function() {
      for (const exp in testData.twoPremise) {
        const result = testData.twoPremise[exp]
        expect(ast.get(exp)).toEqual(result)
      }
    })

    it('hard expressions', function() {
      for (const exp in testData.hard) {
        const result = testData.hard[exp]
        expect(ast.get(exp)).toEqual(result)
      }
    })
  })  

  describe('should stringify', () => {
    it('simple expressions', () => {
      for (const exp in testData.simple) {
        const tree = testData.simple[exp]
        expect(ast.stringify(tree)).toEqual(exp)
      }
    })

    it('two premise expressions', function() {
      for (const exp in testData.twoPremise) {
        const tree = testData.twoPremise[exp]
        expect(ast.stringify(tree)).toEqual(exp)
      }
    })

    it('hard expressions', function() {
      for (const exp in testData.hard) {
        const tree = testData.hard[exp]
        expect(ast.stringify(tree)).toEqual(exp)
      }
    })
    
  })
})
