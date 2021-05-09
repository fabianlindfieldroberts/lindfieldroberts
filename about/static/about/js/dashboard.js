// build table
function tabulate(data, columns, tableHeaders, div) {
  var table = d3.select(div)
    .append('table')
    .attr("id", "stats_table")
  var thead = table.append('thead')
  var tbody = table.append('tbody')

  thead.append('tr')
    .selectAll('th')
    .data(tableHeaders)
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

// all_entries table
d3.json(entriesDataJSON).then(function(data) {
  var columns = ['Participant', 'Date', 'Time', 'Minutes', 'Comment'];
  var tableHeaders = ['Participant', 'Date', 'Time (UCT)', 'Minutes', 'Comment'];
  tabulate(data, columns, tableHeaders, "#all_entries");
});

// summary_stats table
d3.json(statsDataJSON).then(function(data) {
  var columns = ['Stat', 'Mummy', 'Faboo', 'BigG', 'Appalachia'];
  var tableHeaders = ['Stat', 'Mummy', 'Faboo', 'BigG', 'Team Lindies'];
  tabulate(data, columns, tableHeaders, "#summary_stats");
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

  // Prevent the form from being submitted if user reloads page
  // Only works on some browsers
  if ( window.history.replaceState ) {
      window.history.replaceState( null, null, window.location.href );
  }


  $('form').submit(function(e) {
    // Prevent the form from being submitted if user hits button twice
    $('form').submit(function(){
        return false;
    });
    // Check the attestation is checked
    if ($(this).find('input[name="attestation"]')[0].checked === false) {
      $('#error').html("Attestation check unselected");
      return false;
    }
    else {
      return true;
    }
  });
});










