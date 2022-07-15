function createHorizontalBarChart(data, options) {
  // reverse sort data by count
  data = data.sort((a, b) => {
    return a.count - b.count;
  });

  // options:
  bandWidth = options.bandWidth || 20;
  xValueProp = options.xValueProp;
  yValueProp = options.yValueProp;
  chartHeight = data.length * bandWidth;
  chartWidth = options.width;
  margin = options.margin || { top: 0, right: 0, bottom: 0, left: 100 };

  // set the dimensions and margins of the graph
  var width = chartWidth - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom;

  // set the ranges
  var y = d3.scaleBand().range([height, 0]).padding(0.1);

  var x = d3.scaleLinear().range([0, width]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3
    .select('svg')
    .attr('height', chartHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // format the data
  data.forEach(function (d) {
    d[yValueProp] = +d[yValueProp];
  });

  // Scale the range of the data in the domains
  x.domain([
    0,
    d3.max(data, function (d) {
      return d[yValueProp];
    }),
  ]);
  y.domain(
    data.map(function (d) {
      return d[xValueProp];
    })
  );
  //y.domain([0, d3.max(data, function(d) { return d[yValueProp]; })]);

  // append the rectangles for the bar chart
  svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    //.attr("x", function(d) { return x(d[yValueProp]); })
    .attr('width', function (d) {
      return x(d[yValueProp]);
    })
    .attr('y', function (d) {
      return y(d[xValueProp]);
    })
    .attr('height', y.bandwidth());

  // add the x Axis
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append('g').call(d3.axisLeft(y));
}
