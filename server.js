'use strict'

var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.sendFile('/public/index.html', {root: __dirname })
})

app.post('/evaluate', function(req, res) {
  console.log(req)
})

const port = 3000
app.listen(port, function () {
  console.log('Running on port', port)
})
