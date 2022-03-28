function createBarChart(data, options = {}) {
  canvasSelector = options.canvasSelector || 'svg';
  var svg = d3.select(canvasSelector),
    margin = options.margin || 0,
    halfMargin = margin / 2;
  (width = svg.attr('width') - margin),
    (height = svg.attr('height') - margin),
    (xValueProp = options.xValueProp),
    (xAxisLabel = options.xAxisLabel || ''),
    (yValueProp = options.yValueProp),
    (yAxisLabel = options.yAxisLabel || ''),
    (chartTitle = options.chartTitle || '');

  // Chart Title
  svg
    .append('text')
    .attr('transform', 'translate(' + halfMargin + ',0)') // margin/2
    .attr('x', 50)
    .attr('y', 50)
    .attr('font-size', '24px')
    .text(chartTitle);

  // determine x and y scales
  var xScale = d3.scaleBand().range([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]);

  // place graph in svg
  var g = svg
    .append('g')
    .attr('transform', 'translate(' + halfMargin + ',' + halfMargin + ')');

  // get x and y values for scale
  xScale.domain(
    data.map(function (d) {
      return d[xValueProp];
    })
  );
  yScale.domain([
    0,
    d3.max(data, function (d) {
      return d[yValueProp];
    }),
  ]);

  // add x-axis label
  g.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale))
    .append('text')
    .attr('y', height - 1.25 * margin)
    .attr('x', width - halfMargin)
    .attr('text-anchor', 'end')
    .attr('stroke', 'black')
    .text(xAxisLabel);

  // add y-axis ticks, values and label
  g.append('g')
    // add ticks
    .call(
      d3
        .axisLeft(yScale)
        .tickFormat(function (d) {
          return d.toString();
        })
        .ticks(10)
    ) // number of ticks, not size
    // add axis label
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6) // not clear on how this works
    .attr('dy', '-5.1em') // not clear on how this works
    .attr('text-anchor', 'end') // end of text aligns with top of chart
    .attr('stroke', 'black')
    .text(yAxisLabel);

  // add data bars
  g.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function (d) {
      return xScale(d[xValueProp]);
    })
    .attr('y', function (d) {
      return yScale(d[yValueProp]);
    })
    .attr('width', xScale.bandwidth())
    .attr('height', function (d) {
      return height - yScale(d[yValueProp]);
    });
}
