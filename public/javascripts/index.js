google.charts.load('current', {packages:["orgchart"]})
var index = 0
$('#btnEvaluate').on('click', evaluate)
function draw(parent) {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Node');
  data.addColumn('string', 'Parent');
  deep(data, parent);
  var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
  chart.draw(data);
  $('#containerChart').show();
}
function deep(data, node) {
  var parent = tokenString(node.token, index);
  var row = [parent, ''];
  data.addRows([row]);
  if (!!node.children) {
    for (var i = 0; i < node.children.length; i++) {
      index++;
      var child = node.children[i];
      var row = [tokenString(child.token, index), parent]
      data.addRows([row]);
      if (!!child.children) {
        deep(data, child, index);
      }
    }
  }
}
function tokenString(token, index) {
  return '('+index+') ' + token.type + ' ' + token.value;
}
function evaluate() {
  index = 0;
  var expression = $(expressionText).val();
  $.ajax({
    type: 'GET',
    url: '/ast/' + expression,
    dataType: 'json',
    success: function(data) {
      $('#expressionTitle').text(expression);
      draw(data);
    },
    error: function() {
      $('#expressionTitle').text(expression);
      $('#containerChart').show();
      $('#chart_div').html('<p>Wrong expression</p>');
    }
  });
}