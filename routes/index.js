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
module.exports = router