"use strict"

describe('should evaluate logic expression', function() {
  var evaluator = require('../app/compiler.js')

  it('wrong', function() {
    var wrongExpression = [
      'adsdsddb',
      'a23928302;;;ds',
      '*78;l',
      '909;;;90932-0'
    ];
    wrongExpression.forEach(item => {
      const result = evaluator.syntaxTree(item)
      if (result) console.log('wrong test fail ', item)
      expect(result).toBeFalsy()
    })
  })

  describe('simple', function() {
    it('(~P)', function() {
      expect(evaluator.syntaxTree('(~P)')).toEqual({
        type: 'UNARY',
        token: {type: 'NOT', value: '~'},
        children: [{
          type: 'PROP',
          token: {type: 'PREMISE', value: 'P'},
        }]
      })
    })

    it('(P)', function() {
      expect(evaluator.syntaxTree('(P)')).toEqual({
        type: 'PROP',
        token: {type: 'PREMISE', value: 'P'},
      })
    })
  })

  describe('simple w/ 1 implies', function() {
    it('(A->B)', function() {

    })
    it('(A->~B)', function() {

    })
    it('(~A->B)', function() {

    })
    it('(~A->~B)', function() {

    })
  })

  describe('binary on the left', function() {
    it('((A^B)->(AvB))', function() {

    })
    it('(~(A^B)->(A^~B))', function() {

    })
    it('(~(A^B)->~(A^B))', function() {

    })
  })

  describe('full expressions', function() {
    it('(~(PvQ)->(~P^~Q))', function() {

    })

    it('((A->(BvC))->(AvB)v(AvC))', function() {

    })
    it('(((~(P^Q))^P) -> (~Q))', function() {

    })
  })
})
