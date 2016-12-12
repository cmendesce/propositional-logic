'use strict'

const express = require('express'),
  router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { 
    title: 'Proposicional Logic Tools',
    subtitle: 'Analyzes expressions written in propositional logic syntax' 
  })
})

router.get('/about', (req, res, next) => {
  res.render('about', { title: 'About', subtitle: 'About proposicional logic tools' })
})

router.get('/:expression', (request, response) => {
  const expression = request.params.expression
  const tree = ast.get(expression)

  response.status(200).set('Content-Type', 'application/json').send(tree)
})

module.exports = router