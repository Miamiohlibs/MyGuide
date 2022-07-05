/*
Good basic D3 axes tutorial: https://ghenshaw-work.medium.com/customizing-axes-in-d3-js-99d58863738b
*/

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

  // determine x and y scales
  // scaleBand for X because we have discrete values (dates)
  // scaleLinear for Y because we have continuous values (integers)
  var xScale = d3.scaleBand().range([0, width]).padding(0.4);
  var yScale = d3.scaleLinear().range([height, 0]);

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

  // add x axis
  let xAxisGenerator = d3.axisBottom(xScale);

  // manage frequency of x axis labels so they don't overlap
  // based on: https://stackoverflow.com/questions/40199108/d3-v4-scaleband-ticks
  let numPoints = xScale.domain().length;
  let nthTick;
  if (numPoints > 10) {
    if (numPoints < 20) {
      nthTick = 2;
    } else {
      nthTick = Math.floor(numPoints / 10);
    }
    xAxisGenerator.tickValues(
      xScale.domain().filter(function (d, i) {
        return !(i % nthTick);
      })
    );
  }

  // add x-axis label
  g.append('g') // create group for x-axis
    .attr('class', 'axis axis--x') // add class to x-axis
    .attr('transform', 'translate(0,' + height + ')') // position at bottom of chart
    .call(xAxisGenerator) // render x-axis
    .append('text')
    .attr('y', height - 1.25 * margin)
    .attr('x', width - halfMargin)
    .attr('text-anchor', 'end')
    .attr('stroke', 'black')
    .text(xAxisLabel);

  g.select('.axis--x')
    .selectAll('tick')
    .style('opacity', function (d) {
      if (d3.select(this).text().match('[0-9]{4}-[0-9]{2}-01')) {
        return '1';
      } else {
        return '0';
      }
    });

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
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
}
