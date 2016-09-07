"use strict"
var exports = module.exports = {};

exports.valid = function(_exp) {
  //var regex = /[\w][^~v*^][\w](->)[~)]*[\w]/g

  var regex = new RegExp(/(\(?)(~?)[a-z](\)?)(->)(~?)[a-z]/, 'g')
  return regex.test(_exp)
}
