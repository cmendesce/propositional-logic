

const tokenType = require('../app/tokenType.js').Type
    , astType = require('../app/astType.js').AstType

exports.simple = {
  '~P': {
    type: astType.UNARY,
    token: {type: tokenType.NOT, value: '~'},
    children: [
      { type: astType.PROP,
        token: {type: tokenType.PREMISE, value: 'P'}
      }
    ]
  },
  'P': {
    type: astType.PROP,
    token: {type: tokenType.PREMISE, value: 'P'}
  }
}

exports.twoPremise = {
  '(A->B)': {
    type: astType.BINARY,
    token: {type: tokenType.IMPLIES, value: '->'},
    children: [{
        type: astType.PROP,
        token: {type: tokenType.PREMISE, value: 'A'}
      },
      {
        type: astType.PROP,
        token: {type: tokenType.PREMISE, value: 'B'}
      }
    ]
  },
  '(A->~B)': {
    type: astType.BINARY,
    token: {type: tokenType.IMPLIES, value: '->'},
    children: [{
        type: astType.PROP,
        token: {type: tokenType.PREMISE, value: 'A'}
      },
      {
        type: astType.UNARY,
        token: {type: tokenType.NOT, value: '~'},
        children: [
        {
          type: astType.PROP,
          token: {type: tokenType.PREMISE, value: 'B'}
        }]
      }
    ]
  },
  '(~A->B)': {
    type: astType.BINARY,
    token: {type: tokenType.IMPLIES, value: '->'},
    children: [
      {
        type: astType.UNARY,
        token: {type: tokenType.NOT, value: '~'},
        children: [
        {
          type: astType.PROP,
          token: {type: tokenType.PREMISE, value: 'A'}
        }]
      },
      {
        type: astType.PROP,
        token: {type: tokenType.PREMISE, value: 'B'}
      }
    ]
  }
}

exports.hard = {
  '(((A->B)->(A->(B->C)))->(A->C))':
  {
     type: 'BINARY',
     token:{type:'IMPLIES', value:'->'},
     children:[
        {
          type:'BINARY',
          token:{type:'IMPLIES', value:'->'},
          children:[
              {
                 type:'BINARY',
                 token:{type:'IMPLIES',value:'->'},
                 children:[
                    {
                       type:'PROP',
                       token:{type:'PREMISE',value:'A'}
                    },
                    {
                       type:'PROP',
                       token:{type: 'PREMISE',value:'B'}
                    }
                 ]
              },
              {
                type:'BINARY',
                token:{type:'IMPLIES', value:'->'},
                children:[
                  {
                    type:'PROP',
                    token:{type:'PREMISE',value:'A'}
                  },
                  {
                    type:'BINARY',
                    token:{type:'IMPLIES',value:'->'},
                    children:[
                      {
                        type:'PROP',
                        token:{type:'PREMISE',value:'B'}
                      },
                      {
                        type:'PROP',
                        token:{type:'PREMISE',value:'C'}
                      }
                    ]
                  }
                ]
            }
          ]
      },
      {
        type:'BINARY',
        token:{type:'IMPLIES',value:'->'},
        children:[
          {
            type:'PROP',
            token:{type:'PREMISE',value:'A'}
          },
          {
            type:'PROP',
            token:{type:'PREMISE',value:'C'}
          }
        ]
      }
    ]
  }
}
//'((A^B)->(AvB))'
//'(~(A^B)->(A^~B))'
//'(~(A^B)->~(A^B))'
//((A->(BvC))->(AvB)v(AvC))
//(((~(P^Q))^P) -> (~Q))
