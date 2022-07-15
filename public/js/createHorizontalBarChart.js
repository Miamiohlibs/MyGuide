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
  chartTitle = options.chartTitle || '';
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
  var svg = d3.select('svg').attr('height', chartHeight);
  var g = svg
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

  // Create Tooltip
  // code modified from: http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
  var tip = d3.tip();
  tip
    .attr('class', 'd3-tip')
    .offset([-8, 0])
    .html(function (d) {
      return (
        xValueProp +
        ': <b>' +
        d[xValueProp] +
        '</b><br /> ' +
        yValueProp +
        ': <b>' +
        d[yValueProp] +
        '</b>'
      );
    });
  svg.call(tip);

  // Chart Title
  svg
    .append('text')
    .attr('transform', 'translate(' + margin.left + ',0)') // margin/2
    .attr('x', 50)
    .attr('y', 50)
    .attr('font-size', '24px')
    .text(chartTitle);

  // append the rectangles for the bar chart
  g.selectAll('.bar')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'bar-group')
    .append('rect')
    .attr('class', 'bar')
    //.attr("x", function(d) { return x(d[yValueProp]); })
    .attr('width', function (d) {
      return x(d[yValueProp]);
    })
    .attr('y', function (d) {
      return y(d[xValueProp]);
    })
    .attr('height', y.bandwidth())
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

  // append value to each bar
  // this isn't working
  bars = g
    .selectAll('.bar-group')
    .append('text')
    .attr('class', 'label')
    .attr('x', function (d) {
      return x(d[yValueProp]) + 10;
    })
    .attr('y', function (d) {
      return y(d[xValueProp]) + y.bandwidth() / 2;
    })
    .style('color', '#000')
    .text(function (d) {
      return d[yValueProp];
    });

  // add the x Axis
  g.call(d3.axisTop(x));
  g.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  // add the y Axis
  g.append('g').call(d3.axisLeft(y));
}
