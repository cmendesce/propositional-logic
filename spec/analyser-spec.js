"use strict"

describe('should analyse logic expression', function() {
  var analyser = require('../app/analyser.js')

  it('wrong', function() {
    var wrongExpression = [
      'a;b',
      'a23928302;;;ds',
      '*78;l',
      '909;;;90932-0',
      '->'
    ];
    wrongExpression.forEach(item => expect(analyser.valid(item)).toBeFalsy())
  })

  describe('unary', function() {
    it('a->b', function() {
      expect(analyser.valid('a->b')).toBeTruthy()
    })
    it('a->~b', function() {
      expect(analyser.valid('a->~b')).toBeTruthy()
    })
    it('~a->b', function() {
      expect(analyser.valid('~a->b')).toBeTruthy()
    })
    it('~a->~b', function() {
      expect(analyser.valid('~a->~b')).toBeTruthy()
    })
  })

  describe('binary on the left', function() {
    it('(a^b)->b', function() {
      expect(analyser.valid('(a^b)->b')).toBeTruthy()
    })
    it('~(a^b)->~b', function() {
      expect(analyser.valid('~(a^b)->~b')).toBeTruthy()
    })
    it('~(a^b)->b', function() {
      expect(analyser.valid('~(a^b)->b')).toBeTruthy()
    })
  })


})
