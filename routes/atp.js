'use strict'

const express = require('express'),
  router = express.Router(),
  proof = require('../app/resolution/proof'),
  ast = require('../app/ast')

router.get('/index', (req, res, next) => {
  res.render('atp', 
    { title: 'Automatic Theorem Proving' })
})


router.post('/prove', (req, res, next) => {
  const question = req.body.question
  const premises = req.body.premises.split(',')
  console.log(question)
  console.log(premises)
  const result = proof(question, premises)

  console.dir(result, {deep: null, color: true})
  res.render('atp-result', 
    { title: 'Automatic Theorem Proving', 
      proof: {
        question: question,
        premises: premises.join(', '),
        solved: result.solved,
        clauses: result.clauses.map(ast.stringify),
        resolvents: result.resolvents.map(r => {
          return {
            left: ast.stringify(r.left),
            right: ast.stringify(r.right),
            resolvent: r.resolvent ? ast.stringify(r.resolvent) : undefined,
            isNull: r.isNull,
            i: r.i, j: r.j
          }
        })
    }})
})

module.exports = router