// set the dimensions and margins of the graph
var margin = {top: 10, right: 20, bottom: 40, left: 60};
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d");

// set the ranges
var graphX = d3.scaleTime().range([0, width]);
var graphY = d3.scaleLinear().range([height, 0]);


var colorList = ["mediumseagreen", "crimson", "coral", "darkolivegreen", "palevioletred"];

// define average cumulative and non cumulative goal lines
var cumulativeAvgGoalLine = d3.line()
    .x(function(d) { return graphX(d.date); })
    .y(function(d) { return graphY(d.DurationCumulative); });

var nonCumulativeAvgGoalLine = d3.line()
    .x(function(d) { return graphX(d.date); })
    .y(function(d) { return graphY(d.DurationNonCumulative); });



// append the svg obgect to graph container
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#graph")
  .append("svg")
  // Responsive SVG needs these 2 attributes and no width and height attr
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 600 400")
  // Class to make it responsive.
  .classed("svg_content_responsive", true)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// get the graph data
d3.json(graphDataJSON).then(function(data) {

  // create the graph lines, format the date
  var svgLines = {};
  var cumulativeLines = {};
  var nonCumulativeLines = {};

  // Loop through all people in game
  for (var person in data) {

    data[person].forEach(function(d) {

      d.Date = parseTime(d.Date);

      // define cumulative and non cumulative lines for players
      cumulativeLines[person] = d3.line()
        .x(function(d) { return graphX(d.Date); })
        .y(function(d) { return graphY(d.DurationCumulative); });

      nonCumulativeLines[person] = d3.line()
        .x(function(d) { return graphX(d.Date); })
        .y(function(d) { return graphY(d.DurationNonCumulative); });   


    });
  }

  // scale the domain of the data, same for every player
  graphX.domain(d3.extent(data[Object.keys(data)[0]], function(d) { 
    return d.Date; 
  }));

  // scale the range of data, 
  graphY.domain([0, d3.max(Object.values(data), function(d) {
    var globalMax = 0;
    for (person in d) {
      var localMax = Math.max(d[person].DurationCumulative);
      if (localMax > globalMax) { globalMax = localMax };     
    }
    return globalMax;
  })]);

  // add the X Axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(graphX))
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("transform", "translate(-10,0)rotate(-45)");

  // add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(graphY))
      .attr("class", "y_axis");

  // add the cumulative lines and legend
  var legendBaseline = 335;
  var i = 0;
  for (var person in cumulativeLines) {
    
    // add cumulative line
    svgLines[person] = svg.append("path")
      .datum(data[person])
      .attr("class", "line")
      .style("stroke", colorList[i])
      .attr("d", cumulativeLines[person]);

    // legend
    svg.append("circle")
      .attr("cx", 475)
      .attr("cy", legendBaseline - i*15)
      .attr("r", 4)
      .style("fill", colorList[i])
    svg.append("text")
      .attr("x", 482)
      .attr("y", legendBaseline - i*15)
      .text(person)
      .style("font-size", "13px")
      .attr("alignment-baseline","middle");

      // add person head

    i++;
  }

  // add faboo head
  // var fabooHead = svg.append('image')
  //   .attr('xlink:href', fabooHeadPNG)
  //   .attr('width', 20)
  //   .attr('height', 20)
  //   .attr("x", function() { return graphX(actualData[actualData.length - 1].date) - 10 } )
  //   .attr("y", function() { return graphY(actualData[actualData.length - 1].faboo_cumulative) - 10 } )


  // update the chart to show the data for the selected group
  function toggleGraph(isCumulative) {

    // scale the range of data, 
    graphY.domain([0, d3.max(Object.values(data), function(d) {
      var globalMax = 0;
      for (person in d) {
        var localMax = 0;
        if (isCumulative) {
          localMax = Math.max(d[person].DurationCumulative);
        }
        else {
          localMax = Math.max(d[person].DurationNonCumulative);
        }
        if (localMax > globalMax) { globalMax = localMax };     
      }
      return globalMax;
    })]);

    svg.select(".y_axis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(graphY))

    // update the lines
    var i = 0;
    lines = {};
    if (isCumulative) {
      lines = cumulativeLines;
    }
    else {
      lines = nonCumulativeLines;
    }
    for (var person in lines) {
      svgLines[person]
        .transition()
        .duration(1000)
        .attr("d", lines[person]);
      i++;
    }

  //   fabooDots
  //     .transition()
  //     .duration(1000)
  //     .attr("cx", function(d) { return graphX(d.date); } )
  //     .attr("cy", function(d) { 
  //       return graphY(
  //         eval("d.faboo_" + selectedColumnText)
  //       ); 
  //     });

  //   fabooHead
  //     .transition()
  //     .duration(1000)
  //     .attr("y", function() {
  //       return graphY(
  //         eval( "actualData[actualData.length - 1].faboo_" + selectedColumnText )
  //       ) - 10
  //     });

  }

  // respond to click on cumulative and non cumulative buttons
  d3.select("#cumulative_button").on("click", function() {
    $("#non_cumulative_button").removeClass("active");
    $("#cumulative_button").addClass("active");
    toggleGraph(true);
  });
  d3.select("#non_cumulative_button").on("click", function() {
    $("#cumulative_button").removeClass("active");
    $("#non_cumulative_button").addClass("active");
    toggleGraph(false);
  });

});


// build table
function tabulate(data, columns, tableHeaders, div) {
  var table = d3.select(div)
    .append('table')
    .attr("class", "stats_table")
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

// player_stats table
d3.json(playerStatsDataJSON).then(function(data) {
  var columns = ['Stat', 'Mummy', 'Faboo', 'BigG', 'Appalachia'];
  var tableHeaders = ['Stat', 'Mummy', 'Faboo', 'BigG', 'Team Lindies'];
  tabulate(data, columns, tableHeaders, "#player_stats");
});

// player_stats table
d3.json(gameStatsDataJSON).then(function(data) {
  var columns = ['Elapsed', 'Remaining'];
  var tableHeaders = ['Days Elapsed', 'Days Remaining'];
  tabulate(data, columns, tableHeaders, "#game_stats");
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










