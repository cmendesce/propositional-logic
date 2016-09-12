"use strict"
/*
describe('should analyse logic expression', function() {
  var analyser = require('../app/analyser.js')

  it('wrong', function() {
    var wrongExpression = [
      'adsdsddb',
      'a23928302;;;ds',
      '*78;l',
      '909;;;90932-0'
    ];
    wrongExpression.forEach(item => {
      const result = analyser.valid(item)
      if (result) console.log('wrong test fail ', item)
      expect(result).toBeFalsy()
    })
  })

  describe('simple', function() {
    it('(~p)', function() {
      expect(analyser.valid('(~p)')).toBeTruthy()
    })

    it('(p)', function() {
      expect(analyser.valid('(p)')).toBeTruthy()
    })
  })

  describe('simple w/ 1 implies', function() {
    it('(a->b)', function() {
      expect(analyser.valid('(a->b)')).toBeTruthy()
    })
    it('(a->~b)', function() {
      expect(analyser.valid('(a->~b)')).toBeTruthy()
    })
    it('(~a->b)', function() {
      expect(analyser.valid('(~a->b)')).toBeTruthy()
    })
    it('(~a->~b)', function() {
      expect(analyser.valid('(~a->~b)')).toBeTruthy()
    })
  })

  describe('binary on the left', function() {
    it('((a^b)->(avb))', function() {
      expect(analyser.valid('((a^b)->(avb))')).toBeTruthy()
    })
    it('(~(a^b)->(a^~b))', function() {
      expect(analyser.valid('(~(a^b)->(a^~b))')).toBeTruthy()
    })
    it('(~(a^b)->~(a^b))', function() {
      expect(analyser.valid('(~(a^b)->~(a^b))')).toBeTruthy()
    })
  })

  describe('full expressions', function() {
    it('(~(pVq)->(~p^~q))', function() {
      expect(analyser.valid('(~(pVq)->(~p^~q))')).toBeTruthy()
    })

    it('(a->(bVc))->(aVb)V(aVc)', function() {
      expect(analyser.valid('(a->(bVc))->(aVb)V(aVc)')).toBeTruthy()
    })
    it('(((˜(P^Q))^P) -> (˜Q))', function() {
      expect(analyser.valid('(((~(P^Q))^P)->(~Q))')).toBeTruthy()
    })


  })


})
*/
