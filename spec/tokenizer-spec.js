"use strict"

describe('should tokenizer the expression', function() {
  const token = require('../app/token.js')
      , tokenizer = require('../app/tokenizer.js')

  it('(P)', function() {
    var tokens = tokenizer.get('(P)')
    expect(tokens).toEqual([
      {type: token.Type.OPEN, value: '('},
      {type: token.Type.PREMISE, value: 'P'},
      {type: token.Type.CLOSE, value: ')'}
    ])
  })
  it('(~P)', function() {
    var tokens = tokenizer.get('(~P)')
    expect(tokens).toEqual([
      {type: token.Type.OPEN, value: '('},
      {type: token.Type.NOT, value: '~'},
      {type: token.Type.PREMISE, value: 'P'},
      {type: token.Type.CLOSE, value: ')'}
    ])
  })
})
