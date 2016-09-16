'use strict'

describe('Tokenizer: should tokenizer the expression', function() {
  const token = require('../app/token.js')
      , tokenType = require('../app/tokenType.js').Type
      , tokenizer = require('../app/tokenizer.js')

  it('(P)', function() {
    var tokens = tokenizer.get('(P)')
    expect(tokens).toEqual([
      {type: tokenType.OPEN, value: '('},
      {type: tokenType.PREMISE, value: 'P'},
      {type: tokenType.CLOSE, value: ')'}
    ])
  })
  it('(~P)', function() {
    var tokens = tokenizer.get('(~P)')
    expect(tokens).toEqual([
      {type: tokenType.OPEN, value: '('},
      {type: tokenType.NOT, value: '~'},
      {type: tokenType.PREMISE, value: 'P'},
      {type: tokenType.CLOSE, value: ')'}
    ])
  })
})
