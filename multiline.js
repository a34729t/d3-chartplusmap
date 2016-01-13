var svg, xScale, yScale;
var width, height, margin;
var mouseoverCallback, mouseoutCallback;

var line = d3.svg.line().interpolate("monotone")
.x(function(d){ return xScale(d.date); })
.y(function(d){
  return yScale(d[valueKey]);
});

function setupChart(mouseoverCallback, mouseoutCallback) {
  width = chartWidth;
  height = chartHeight;
  margin = {top: 20, right:100, bottom:100, left:70};

  mouseoverCallback = mouseoverCallback;
  mouseoutCallback = mouseoutCallback;

  // TODO: Make svg go into correct div instead of failing pathetically

  // draw and append the container
  svg = d3.select(chartContainerDiv).append("svg")
  .attr("height", height)
  .attr("width", width)
  .append("g")
  .attr("transform","translate(" + margin.left + "," + margin.right + ")");

  xScale = d3.time.scale()
  .range([0,width - margin.left - margin.right]);

  yScale = d3.scale.linear()
  .range([height - margin.top - margin.bottom,0]);
}

function highlightChart(name, highlight) {
  var line = svg.select("#"+name+"-line");
  var label = svg.select("#"+name+"-label");

  if (highlight) {
    console.log("#"+name+"-line");
    console.log(line);



    line
      .attr('stroke-width', '') // Un-sets the "explicit" stroke-width
      .classed("active-line", true ); // should then accept stroke-width from CSS

    label.style("font-size","15px");
  } else {
    line
      .classed("active-line", false)
      .attr('stroke-width', function(d) { return d[valueKey]; }) // Re-sets the "explicit" stroke-width

    label.style("font-size","12px");
  }
}

var chartElementCallback = {

  // TODO: Bold the text of the corresponding label

  mouseover: function(d){
    var countryName = d[0].name;
    mouseoverCallback(countryName);
  },

  mouseout: function(d){
    var countryName = d[0].name;
    mouseoutCallback(countryName);
  }
};

function renderChart(absoluteMode, valueKey){

  // Y-Axis

  // create axis scale
  yScale.domain(valueRange(data, valueKey));
  var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left");

  // if no axis exists, create one, otherwise update it
  if (svg.selectAll(".y.axis")[0].length < 1){
    svg.append("g")
    .attr("class","y axis")
    .call(yAxis);
  } else {
    svg.selectAll(".y.axis").transition().duration(transitionAnimationDuration).call(yAxis);
  }

  // X-Axis

  // create axis scale
  xScale.domain(dateRange(data));
  var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom");

  yAxisPosition = height - margin.bottom - margin.top;
  if (svg.selectAll(".x.axis")[0].length < 1){
    svg.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + yAxisPosition + ")")
    .text("Date")
    .call(xAxis);
  }

  // Colors by key
  var color = d3.scale.category10();

  // Lines (paths)
  var lines = svg.selectAll(".line").data(data, function(d) { return d[0].name; }).attr("class","line");

  lines.enter()
  .append("path")
  .attr("class","line")
  .attr("id", function(d){ return d[0].name + "-line" })
  .attr("d",line)
  .on('mouseover', chartElementCallback.mouseover)
  .on('mouseout', chartElementCallback.mouseout)
  .style("stroke", function(d){
    var key = d[0].name;
    return color(key);
  });

  lines.exit().remove();

  // Labels (text)
  var labels = svg.selectAll(".chart-label").data(data, function(d) { return d[0].name; }).attr("class","chart-label");

  labels.enter()
    .append("text")
    .attr("class", "chart-label")
    .attr("id", function(d){ return d[0].name + "-label" })
    .on('mouseover', chartElementCallback.mouseover)
    .on('mouseout', chartElementCallback.mouseout)
    .attr("transform", function(d) {
      var datum = d[d.length - 1];
      var value = datum[valueKey];
      return "translate(" + (width - margin.left - margin.right + 10) + "," + yScale(datum[valueKey]) + ")"})
    .style("fill", function(d){ return color(d[0].name); })
    .style("font-size","12px")
    .text(function(d){ return d[0].name });

  labels.exit().remove();

  // Animations to transition from relative to absolute mode
  lines.transition().duration(transitionAnimationDuration)
    .attr("d",line);

  labels.transition().duration(transitionAnimationDuration)
    .attr("transform", function(d) {
        var datum = d[d.length - 1];
        var value = datum[valueKey];
        return "translate(" + (width - margin.left - margin.right + 10) + "," + yScale(datum[valueKey]) + ")"});
}

