// set the dimensions and margins of the graph
var margin = {top: 10, right: 20, bottom: 40, left: 60};
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var graphX = d3.scaleTime().range([0, width]);
var graphY = d3.scaleLinear().range([height, 0]);


// define cumulative and non cumulative faboo lines
var cumulativeLineFaboo = d3.line()
  .x(function(d) { return graphX(d.date); })
  .y(function(d) { return graphY(d.faboo_cumulative); });

var nonCumulativeLineFaboo = d3.line()
  .x(function(d) { return graphX(d.date); })
  .y(function(d) { return graphY(d.faboo_non_cumulative); });


// define cumulative and non cumulative daddy lines
var cumulativeLineDaddy = d3.line()
    .x(function(d) { return graphX(d.date); })
    .y(function(d) { return graphY(d.daddy_cumulative); });

var nonCumulativeLineDaddy = d3.line()
    .x(function(d) { return graphX(d.date); })
    .y(function(d) { return graphY(d.daddy_non_cumulative); });


// define average cumulative and non cumulative goal lines
var cumulativeAvgGoalLine = d3.line()
    .x(function(d) { return graphX(d.date); })
    .y(function(d) { return graphY(d.avg_goal_cumulative); });

var nonCumulativeAvgGoalLine = d3.line()
    .x(function(d) { return graphX(d.date); })
    .y(function(d) { return graphY(d.avg_goal_non_cumulative); });

// define customized goal lines cumulative and non cumulative
var cumulativeCustomGoalLineFaboo = d3.line()
    .x(function(d) { return graphX(d.date); })
    .y(function(d) { return graphY(d.faboo_custom_goal_cumulative); });

var nonCumulativeCustomGoalLineFaboo = d3.line()
    .x(function(d) { return graphX(d.date); })
    .y(function(d) { return graphY(d.faboo_custom_goal_non_cumulative); });

var cumulativeCustomGoalLineDaddy = d3.line()
    .x(function(d) { return graphX(d.date); })
    .y(function(d) { return graphY(d.daddy_custom_goal_cumulative); });

var nonCumulativeCustomGoalLineDaddy = d3.line()
    .x(function(d) { return graphX(d.date); })
    .y(function(d) { return graphY(d.daddy_custom_goal_non_cumulative); });

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
d3.csv(graphDataCSV).then(function(data) {

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.faboo_cumulative = +d.faboo_cumulative;
      d.daddy_cumulative = +d.daddy_cumulative;
  });

  // scale the range of the data
  graphX.domain(d3.extent(data, function(d) { return d.date; }));
  graphY.domain([0, d3.max(data, function(d) {
    return Math.max(d.faboo_cumulative, d.daddy_cumulative, d.avg_goal_cumulative); })]);

  var cutoffDate = new Date(2021, 3, 27); // year, month (0 indexed), day
  actualData = data.filter(function(d) {
    return d.date <= cutoffDate;
  });
  predictedData = data.filter(function(d) {
    return d.date >= cutoffDate;
  });

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

  // add goal line
  var avgGoalLine = svg.append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke-dasharray", ("3, 3"))
    .attr("d", cumulativeAvgGoalLine);

  // legend
  svg.append("circle")
    .attr("cx",475)
    .attr("cy",320)
    .attr("r", 4)
    .style("fill", "crimson")
  svg.append("circle")
    .attr("cx",475)
    .attr("cy",335)
    .attr("r", 4)
    .style("fill", "mediumseagreen")
  svg.append("text")
    .attr("x", 482)
    .attr("y", 320)
    .text("Faboo")
    .style("font-size", "13px")
    .attr("alignment-baseline","middle")
  svg.append("text")
    .attr("x", 482)
    .attr("y", 335)
    .text("Daddy")
    .style("font-size", "13px")
    .attr("alignment-baseline","middle")


  // add custom goal for fabian
  var fabooGoalLine = svg.append("path")
    .data([predictedData])
    .attr("class", "line")
    .style("stroke-dasharray", ("3, 3"))
    .style("stroke", "crimson")
    .attr("d", cumulativeCustomGoalLineFaboo);

  // add custom goal line for daddy
  var daddyGoalLine = svg.append("path")
    .data([predictedData])
    .attr("class", "line")
    .style("stroke-dasharray", ("3, 3"))
    .style("stroke", "mediumseagreen")
    .attr("d", cumulativeCustomGoalLineDaddy);

  // add the faboo path and dots
  var fabooLine = svg.append("path")
    .data([actualData])
    .attr("class", "line")
    .style("stroke", "crimson")
    .attr("d", cumulativeLineFaboo);

  var fabooDots = svg.append("g")
    .selectAll("dot")
    .data(actualData)
    .enter()
    .append("circle")
    .attr("class", "data_point")
    .attr("cx", function(d) { return graphX(d.date); } )
    .attr("cy", function(d) { return graphY(d.faboo_cumulative); } )
    .attr("r", 2)
    .attr("stroke", "crimson")
    .attr("stroke-width", 1)
    .attr("fill", "crimson")

  // add faboo head
  var fabooHead = svg.append('image')
    .attr('xlink:href', fabooHeadPNG)
    .attr('width', 20)
    .attr('height', 20)
    .attr("x", function() { return graphX(actualData[actualData.length - 1].date) - 10 } )
    .attr("y", function() { return graphY(actualData[actualData.length - 1].faboo_cumulative) - 10 } )

  // add the daddy path and dots
  var daddyLine = svg.append("path")
    .data([actualData])
    .attr("class", "line")
    .style("stroke", "mediumseagreen")
    .attr("d", cumulativeLineDaddy);

  var daddyDots = svg.append("g")
    .selectAll("dot")
    .data(actualData)
    .enter()
    .append("circle")
    .attr("class", "data_point")
    .attr("cx", function(d) { return graphX(d.date); } )
    .attr("cy", function(d) { return graphY(d.daddy_cumulative); } )
    .attr("r", 2)
    .attr("stroke", "mediumseagreen")
    .attr("stroke-width", 1)
    .attr("fill", "mediumseagreen")

  // add daddy head
  var daddyHead = svg.append('image')
    .attr('xlink:href', daddyHeadPNG)
    .attr('width', 20)
    .attr('height', 20)
    .attr("x", function() { return graphX(actualData[actualData.length - 1].date) - 10 } )
    .attr("y", function() { return graphY(actualData[actualData.length - 1].daddy_cumulative) - 10 } )


  // update the chart to show the data for the selected group
  function toggleGraph(selectedVariableText, selectedColumnText) {

    var padding = (selectedColumnText == "cumulative") ? 0 : 10000;

    graphY.domain([0, d3.max(data, function(d) {
        return Math.max(
          eval("d.faboo_" + selectedColumnText), 
          eval("d.daddy_" + selectedColumnText), 
          eval("d.avg_goal_" + selectedColumnText)
        ) + padding; 
      })
    ]);

    svg.select(".y_axis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(graphY))


    // Give these new data to update line
    avgGoalLine
      .transition()
      .duration(1000)
      .attr("d", eval(selectedVariableText + "AvgGoalLine"));

    fabooGoalLine
      .transition()
      .duration(1000)
      .attr("d", eval(selectedVariableText + "CustomGoalLineFaboo"));

    daddyGoalLine
      .transition()
      .duration(1000)
      .attr("d", eval(selectedVariableText + "CustomGoalLineDaddy"));

    fabooLine
      .transition()
      .duration(1000)
      .attr("d", eval(selectedVariableText + "LineFaboo"));

    fabooDots
      .transition()
      .duration(1000)
      .attr("cx", function(d) { return graphX(d.date); } )
      .attr("cy", function(d) { 
        return graphY(
          eval("d.faboo_" + selectedColumnText)
        ); 
      });

    fabooHead
      .transition()
      .duration(1000)
      .attr("y", function() {
        return graphY(
          eval( "actualData[actualData.length - 1].faboo_" + selectedColumnText )
        ) - 10
      });

    daddyLine
      .transition()
      .duration(1000)
      .attr("d", eval(selectedVariableText + "LineDaddy"));

    daddyDots
      .transition()
      .duration(1000)
      .attr("cx", function(d) { return graphX(d.date); } )
      .attr("cy", function(d) { 
        return graphY(
          eval("d.daddy_" + selectedColumnText)
        ); 
      });

    daddyHead
      .transition()
      .duration(1000)
      .attr("y", function() {
        return graphY(
          eval( "actualData[actualData.length - 1].daddy_" + selectedColumnText )
        ) - 10
      });

  }

  // respond to click on cumulative and non cumulative buttons
  d3.select("#cumulative_button").on("click", function() {
    $("#non_cumulative_button").removeClass("active");
    $("#cumulative_button").addClass("active");
    toggleGraph("cumulative", "cumulative");
  });
  d3.select("#non_cumulative_button").on("click", function() {
    $("#cumulative_button").removeClass("active");
    $("#non_cumulative_button").addClass("active");
    toggleGraph("nonCumulative", "non_cumulative");
  });

});


// get the stats table data
d3.csv(statsDataCSV).then(function(data) {

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

  
  var columns = ['Stat','Faboo','Daddy'];
  tabulate(data,columns);

});



$("#rules_button").click(function() {
  $("#graph_container").hide();
  $("#stats_container").hide();
  $("#rules_container").show();
  $("#graphs_button").removeClass("active");
  $("#stats_button").removeClass("active");
  $("#rules_button").addClass("active");
});
$("#graphs_button").click(function() {
  $("#rules_container").hide();
  $("#stats_container").hide();
  $("#graph_container").show();
  $("#rules_button").removeClass("active");
  $("#stats_button").removeClass("active");
  $("#graphs_button").addClass("active");
});
$("#stats_button").click(function() {
  $("#rules_container").hide();
  $("#graph_container").hide();
  $("#stats_container").show();
  $("#graphs_button").removeClass("active");
  $("#rules_button").removeClass("active");
  $("#stats_button").addClass("active");
});








