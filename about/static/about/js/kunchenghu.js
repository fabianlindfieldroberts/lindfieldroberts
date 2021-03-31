// set the dimensions and margins of the graph
var cumulativeGraphMargin = {top: 20, right: 20, bottom: 30, left: 80},
    width = 960 - cumulativeGraphMargin.left - cumulativeGraphMargin.right,
    height = 500 - cumulativeGraphMargin.top - cumulativeGraphMargin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var cumulativeGraphX = d3.scaleTime().range([0, width]);
var cumulativeGraphY = d3.scaleLinear().range([height, 0]);

// define faboo line
var cumulativeGraphFabooLine = d3.line()
    .x(function(d) { return cumulativeGraphX(d.date); })
    .y(function(d) { return cumulativeGraphY(d.faboo); });

// define daddy line
var cumulativeGraphDaddyLine = d3.line()
    .x(function(d) { return cumulativeGraphX(d.date); })
    .y(function(d) { return cumulativeGraphY(d.daddy); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var cumulativeGraphSVG = d3.select("body").append("svg")
    .attr("width", width + cumulativeGraphMargin.left + cumulativeGraphMargin.right)
    .attr("height", height + cumulativeGraphMargin.top + cumulativeGraphMargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + cumulativeGraphMargin.left + "," + cumulativeGraphMargin.top + ")");

// Get the data
d3.csv(dataCSV).then(function(data) {

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.faboo = +d.faboo;
      d.daddy = +d.daddy;
  });

  // Scale the range of the data
  cumulativeGraphX.domain(d3.extent(data, function(d) { return d.date; }));
  cumulativeGraphY.domain([0, d3.max(data, function(d) {
    return Math.max(d.faboo, d.daddy, 1200000); })]);

  // Add the faboo path
  cumulativeGraphSVG.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", cumulativeGraphFabooLine);

  // Add the daddy path
  cumulativeGraphSVG.append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "red")
    .attr("d", cumulativeGraphDaddyLine);

  // Add the X Axis
  cumulativeGraphSVG.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(cumulativeGraphX))
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("transform", "translate(-10,0)rotate(-45)");

  // Add the Y Axis
  cumulativeGraphSVG.append("g")
      .call(d3.axisLeft(cumulativeGraphY));

});