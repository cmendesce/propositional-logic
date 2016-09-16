'use strict'

const ast = require('./app/ast.js')
    , express = require('express')
    , logger = require('morgan')
    , bodyParser = require('body-parser')

const app = module.exports.app = express()
app.use(logger('dev'))
app.use(express.static(__dirname + '/public/js'))
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
  res.sendFile('/public/index.html', {root: __dirname })
})
app.get('/about', function (req, res) {
  res.sendFile('/public/about.html', {root: __dirname })
})

app.get('/ast/:expression', function(request, response) {
  const expression = request.params.expression
  console.log('generating ast for expression --->', expression)
  const tree = ast.get(expression)

  response.status(200).set('Content-Type', 'application/json').send(tree)
})

app.listen(app.get('port'), function () {
  console.log('Running on port', app.get('port'))
})
