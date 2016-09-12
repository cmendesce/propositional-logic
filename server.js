'use strict'

const evaluator = require('./app/compiler.js')
    , express = require('express')
    , logger = require('morgan')
    , bodyParser = require('body-parser')

const app = module.exports.app = express()
app.use(logger('dev'))
app.use(express.static(__dirname + '/public/static'))
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
  res.sendFile('/public/index.html', {root: __dirname })
})
app.get('/about', function (req, res) {
  res.sendFile('/public/about.html', {root: __dirname })
})

app.post('/evaluate', function(request, response) {
  const expression = request.body.expression
  console.log('evaluating the expression --->', expression)
  const tree = evaluator.asTree(expression)

  response.status(200).set('Content-Type', 'application/json').send(tree)
})

app.listen(app.get('port'), function () {
  console.log('Running on port', app.get('port'))
})
