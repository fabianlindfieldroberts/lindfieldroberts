// get the stats table data
d3.json(entriesDataJSON).then(function(data) {

  // build stats table
  function tabulate(data,columns) {
    var table = d3.select('#stats_container')
      .append('table')
      .attr("id", "stats_table")
    var thead = table.append('thead')
    var tbody = table.append('tbody')

    thead.append('tr')
      .selectAll('th')
      .data(columns)
      .enter()
      .append('th')
      .text(function (d) { return d })

    var rows = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr')

    var cells = rows.selectAll('td')
      .data(function(row) {
        return columns.map(function (column) {
          return { 
            column: column, 
            value: row[column] 
          }
        })
      })
      .enter()
      .append('td')
      .text(function (d) { return d.value })

    return table;
  }

  
  var columns = ['Participant', 'Date', 'Time', 'Duration', 'Comment'];
  tabulate(data,columns);

});

$(document).ready(function() {

  $("#rules_button").click(function() {
    $("#graph_container, #stats_container, #submit_container").hide();
    $("#rules_container").show();
    $("#graphs_button, #stats_button, #submit_button").removeClass("active");
    $("#rules_button").addClass("active");
  });
  $("#graphs_button").click(function() {
    $("#rules_container, #stats_container, #submit_container").hide();
    $("#graph_container").show();
    $("#rules_button, #stats_button, #submit_button").removeClass("active");
    $("#graphs_button").addClass("active");
  });
  $("#stats_button").click(function() {
    $("#rules_container, #graph_container, #submit_container").hide();
    $("#stats_container").show();
    $("#graphs_button, #rules_button, #submit_button").removeClass("active");
    $("#stats_button").addClass("active");
  });
  $("#submit_button").click(function() {
    $("#rules_container, #graph_container, #stats_container").hide();
    $("#submit_container").show();
    $("#graphs_button, #rules_button, #stats_button").removeClass("active");
    $("#submit_button").addClass("active");
  });


  $('form').submit(function(e) {
    if ($(this).find('input[name="attestation"]')[0].checked === false) {
      $('#error').html("Attestation check unselected");
      return false;
    }
    else {
      return true;
    }
  });
});










