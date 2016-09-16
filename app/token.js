'use strict'

var exports = module.exports = { }

const tokenType = require('../app/tokenType.js').Type

exports.from = function(part) {
  let type

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
        value: part
      }
    }
}
