'use strict'

const express = require('express'),
  router = express.Router(),
  ast = require('../app/ast')

router.get('/index', (req, res, next) => {
  res.render('ast', 
    { title: 'Abtract Syntax Tree' })
})

router.get('/:expression', (req, res, next) => {
  const expression = req.params.expression
  const tree = ast.get(expression)
  res.status(200).set('Content-Type', 'application/json').send(tree)
})

module.exports = router