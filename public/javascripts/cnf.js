
$('#btnEvaluate').on('click', evaluate);
function evaluate() {
  var expression = $(expressionText).val();
  $.ajax({
    type: 'GET',
    url: '/cnf/' + expression,
    dataType: 'json',
    success: function(data) {
      var tree = new Tree();
      tree.generate(data.tree);
      $('#cnf').text(data.expression)
      $('#results').show()
    },
    error: function() {
      $('#expressionTitle').text(expression);
      $('#containerChart').show();
      $('#chart_div').html('<p>Wrong expression</p>');
    }
  });
}