'use strict'

const tokenType = require('../app/tokenType').Type
const is = (root, tType) => {
  if (!root) return false
  return root.token.type === tType
}

const has = children => !!children && children.length > 0

module.exports = {is: is, has: has}