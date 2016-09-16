'use strict'

describe('AST: should get abstract syntax tree from a', function() {
  const ast = require('../app/ast.js')
  const testData = require('../spec/ast-test-data.js')

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
