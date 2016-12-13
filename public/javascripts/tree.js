google.charts.load('current', {packages:["orgchart"]});

var Tree = function() {
  var index = 0;

  this.generate = function(ast) {
    index = 0;
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Node');
    data.addColumn('string', 'Parent');
    deep(data, ast);
    var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
    chart.draw(data);
    $('#containerChart').show();
  };

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
  };

  function tokenString(token, index) {
    return '('+index+') ' + token.type + ' ' + token.value;
  };
};