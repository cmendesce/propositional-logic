'use strict'

const express = require('express'),
  router = express.Router(),
  cnf = require('../app/cnf')

router.get('/index', (req, res, next) => {
  res.render('cnf', 
    { title: 'Conjunctive Normal Form' })
})

router.get('/:expression', (req, res, next) => {
  const expression = req.params.expression
  const result = cnf.convert(expression)
  res.status(200).set('Content-Type', 'application/json').send(result)
})

module.exports = router