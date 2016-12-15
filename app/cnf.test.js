'use strict'



const token = require('../app/token'), 
	tokenType = require('../app/tokenType').Type, 
	ast = require('../app/ast'), 
	astType = require('../app/astType').AstType,
	formula = require('../app/formula'),
	or = formula.or, 
	and = formula.and,
	not = formula.not;


const convert = (root) => {
  
  if (!root) return null

  if (root.type === astType.PROP) {
    return root;
  }

  if (root.token.type === tokenType.AND) {
    let p = convert(root.children[0])
    let q = convert(root.children[1])
    return and(p, q)
  }

  if (root.token.type === tokenType.OR) {
    let p = convert(root.children[0])
    let q = convert(root.children[1])
    return and(p, q)
  }

  if (root.type === astType.UNARY) {
    if (root.children[0].type === astType.PROP) {
      return root
    }

    if (root.children[0].type === astType.UNARY) {
      return root.children[0].children[0]
    }

    if (root.token.type === tokenType.AND) {
      let p = root.children[0]
      let q = root.children[1]
      return or(not(p), not(q))
    }
    
    if (root.token.type === tokenType.OR) {
      let p = root.children[0]
      let q = root.children[1]
      return and(not(p), not(q))
    }
  }

  if (root.token.type === tokenType.IMPLIES) {
    let p = root.children[0]
    let q = root.children[1]
    return or(not(p), q)
  }
}



module.exports = {convert:convert}