"use strict"

describe('should create token from char', function() {
  const token = require('../app/token.js')
  it('and', function() {
    const t = token.create('^')
    expect(t.type).toBe(token.Type.AND)
  })
  it('or', function() {
    const t = token.create('v')
    expect(t.type).toBe(token.Type.OR)
  })
  it('not', function() {
    const t = token.create('~')
    expect(t.type).toBe(token.Type.NOT)
  })
  it('open', function() {
    const t = token.create('(')
    expect(t.type).toBe(token.Type.OPEN)
  })
  it('clone', function() {
    const t = token.create(')')
    expect(t.type).toBe(token.Type.CLOSE)
  })
  it('implies', function() {
    const t = token.create('->')
    expect(t.type).toBe(token.Type.IMPLIES)
  })
  it('premise', function() {
    const t = token.create('A')
    expect(t.type).toBe(token.Type.PREMISE)
  })
  it('double premise', function() {
    const t = token.create('AB')
    expect(t.type).toBe(token.Type.PREMISE)
  })
  it('invalid token', function() {
    const t = token.create('&')
    expect(t).toBeUndefined()
  })
})
