'use strict'

var exports = module.exports = {}
const token = require('../app/token.js')

exports.get = function(exp) {
  let tokens = []

  for (var i = 0, len = exp.length; i < len; i++) {
    const char = exp[i]
		var t;
		if (char === '-') {
			t = token.from(char + exp[i+1])
		} else {
			t = token.from(char)
		}
		if (!!t) tokens.push(t)
  }

  return tokens
}
