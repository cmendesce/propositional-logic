'use strict'


describe('Token: should from token from char', function() {
  const token = require('../app/token.js')
  const tokenType = require('../app/tokenType.js').Type

  it('and', function() {
    const t = token.from('^')
    expect(t.type).toBe(tokenType.AND)
  })
  it('or', function() {
    const t = token.from('v')
    expect(t.type).toBe(tokenType.OR)
  })
  it('not', function() {
    const t = token.from('~')
    expect(t.type).toBe(tokenType.NOT)
  })
  it('open', function() {
    const t = token.from('(')
    expect(t.type).toBe(tokenType.OPEN)
  })
  it('clone', function() {
    const t = token.from(')')
    expect(t.type).toBe(tokenType.CLOSE)
  })
  it('implies', function() {
    const t = token.from('->')
    expect(t.type).toBe(tokenType.IMPLIES)
  })
  it('premise', function() {
    const t = token.from('A')
    expect(t.type).toBe(tokenType.PREMISE)
  })
  it('double premise', function() {
    const t = token.from('AB')
    expect(t.type).toBe(tokenType.PREMISE)
  })
  it('invalid token', function() {
    const t = token.from('&')
    expect(t).toBeUndefined()
  })
})
