
$('#btnEvaluate').on('click', evaluate);
function evaluate() {
  var tree = new Tree();
  var expression = $(expressionText).val();
  $.ajax({
    type: 'GET',
    url: '/ast/' + expression,
    dataType: 'json',
    success: function(data) {
      $('#expressionTitle').text(expression);
      tree.generate(data);
    },
    error: function() {
      $('#expressionTitle').text(expression);
      $('#containerChart').show();
      $('#chart_div').html('<p>Wrong expression</p>');
    }
  });
}