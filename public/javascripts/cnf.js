
$('#btnEvaluate').on('click', evaluate);
function evaluate() {
  var expression = $(expressionText).val();
  $.ajax({
    type: 'GET',
    url: '/cnf/' + expression,
    dataType: 'json',
    success: function(data) {
      var tree = new Tree();
      
      tree.generate(data.result.tree);
      $('#steps').empty();
      for (var step in data.steps) {
        $('#steps').append($('<li>').text('Step ' + (parseInt(step) + 1) + ' - ' + data.steps[step].expression))
      }
      console.log(data)
      $('#results').show()
    },
    error: function(data) {
      
      $('#expressionTitle').text(expression);
      $('#containerChart').show();
      $('#chart_div').html('<p>Wrong expression</p>');
    }
  });
}