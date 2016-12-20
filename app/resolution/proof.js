'use strict'

const r = f => require('../../app/' + f)

const tokenType = r('tokenType').Type, 
	cnf = r('cnf').convert,
  ast = r('ast'),
	or = r('formula').or,
	h = r('helper'),
  resolution = r('resolution/resolution'),
  _ = require('lodash')

const isLiteral = resolution.isLiteral,
  isComplementary = resolution.isComplementary,
  literalEquals = resolution.literalEquals

const getClauses = premises => 
  premises.filter(p => !!p).map(a => resolution.generateClauses(cnf(a).tree)).reduce((a, b) => a.concat(b))


let calls = [] // calls of p1 in p2
const isCalled = (a, b) =>
  calls.filter(e => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a)).length > 0
const registerCall = (a, b) => calls.push([a, b])

const proof = (question, premises) => {
  if (!question || !premises) return null

	premises.push('~' + question)
	const clauses = getClauses(premises)

	const pureClauses = clauses.map(ast.stringify)
	const resolvents = []
  const discarted = []
	let solved = false
  let count = 0

	for (let i = 0; i < clauses.length; i++) {
		if (solved) break

		for (let j = 0; j < clauses.length; j++) {
      const a = clauses[i]
      const b = clauses[j]

      if (i === j || _.isEqual(a, b) || isCalled(i, j)) continue
      
      registerCall(i, j)
      const result = resolve(a, b)

      if (!!result) {
        result.i = i + 1
        result.j = j + 1
        
        if (result.isNull) {
          resolvents.push(result)
          solved = true
          break
        } else {
           
          if (!!result.resolvent && !_.includes(pureClauses, ast.stringify(result.resolvent))) {
            resolvents.push(result)
            clauses.push(result.resolvent)
            pureClauses.push(ast.stringify(result.resolvent))
            j = 0
            i = 0
          }
        }
      } else discarted.push([i, j])
	  }
  }

  calls = []
  return {
    solved: solved,
    clauses: clauses,
    resolvents: resolvents,
    discarted: discarted
  }
}

const resolve = (a, b) => {
	const result = {
		left: a, 
		right: b,
		resolvent: null,
		isNull: false
	}

	if (!a || !b) {
		return undefined
	}
  
	if (isLiteral(a) && isLiteral(b)) { // a and b are literals
    result.isNull = isComplementary(a, b)
	} else if (isLiteral(a)) {
    // a is literal. b is formula
    result.resolvent = literalAndFormula(a, b)
	} else if (isLiteral(b)) { 
    // b is literal. a is formula
		result.resolvent = literalAndFormula(b, a)
	} else { // a and b are formulas
		const a1 = a.children[0],
			a2 = a.children[1],
			b1 = b.children[0],
			b2 = b.children[1]
    
    if (literalEquals(a1, a2)) {
      result.resolvent = a1
    } else if (literalEquals(b1, b2)) {
      result.resolvent = b1
    } else if (isComplementary(a1, b1)) {
			result.resolvent = or(a2, b2)
		} else if (isComplementary(a1, b2)) {
			result.resolvent = or(a2, b1)
		} else if (isComplementary(a2, b1)) {
			result.resolvent = or(a1, b2)
		} else if (isComplementary(a2, b2)) {
			result.resolvent = or(a1, b1)
		}
	}
	return result
}

const literalAndFormula = (l, p) => {
  let resolvent = null
  const p1 = p.children[0],
			p2 = p.children[1]

  if (isComplementary(l, p1) && isComplementary(l, p2)) { // n vale eliminar os dois
    resolvent = undefined
  } else if (isComplementary(l, p1)) { // b2 é a formula pra ser utilizada
    resolvent = p2
  } else if (isComplementary(l, p2)) { // b1 é o retorno
    resolvent = p1
  }
  return resolvent   
}


module.exports = proof


const log = msg => console.dir(msg, {depth: null, colors: true})


// const r1 =  proof('(A ^ B)', ['(A -> B)', '(B -> A)', '(A v B)'])
// proof('(A ^ B)', ['(A v B)', '(A -> B)', '(B -> A)'])
// const r1 =  proof('(C)', ['(A -> C)', '(B -> C)', '(A v B)'])

// for (let item of r1.clauses) {  
//   console.log(`${ast.stringify(item)}`)
// }

// console.log('---------------------------------------------')

// r1.resolvents.sort((a, b) => {
//   if (a.i > b.i) return 1;
//   if (a.i < b.i) return -1;
//   return 0;
// })
// r1.discarted.sort()

// for (let item of r1.resolvents) {
//   if (item.isNull) {
//     console.log(`(${item.i}, ${item.j}) <-- Null clause`)
//   } else {
//     if (!item.resolvent) {
//       log(item)
//     }
//     console.log(`(${item.i}, ${item.j}) = ${ast.stringify(item.resolvent)}`)
//   }
// }
// console.log('---------------------------------------------')
// for (let item of r1.discarted) {
//   console.log(`(${item[0]+1}, ${item[1]+1})`)
// }