'use strict'

var exports = module.exports = {}

const tokenType = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  NOT: 'NOT',
  AND: 'AND',
  OR: 'OR',
  IMPLIES: 'IMPLIES',
  PREMISE: 'PREMISE'
}

exports.Type = tokenType

exports.create = function(part) {
  let type;
  let value = part;
  switch (part) {
    case '(':
      type = tokenType.OPEN
      break;
    case ')':
      type = tokenType.CLOSE
      break;
    case '^':
      type = tokenType.AND
      break;
    case 'v':
      type = tokenType.OR
      break;
    case '~':
      type = tokenType.NOT
      break;
    case '->':
      value = '\u2192'
      type = tokenType.IMPLIES
      break;
    default:
      if (/([A-Z])/g.test(part)) {
        type = tokenType.PREMISE
      }
    }
    if (!type) {
      return undefined
    } else {
      return {
        type: type,
        value: value
      }
    }
}
