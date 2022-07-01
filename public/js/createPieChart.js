/*
 This function creates a pie chart
 It is based on the code from the following link:
 https://www.educative.io/answers/how-to-create-a-pie-chart-using-d3 (Accessed: July 1 2022)
*/

function createPieChart(data, options = {}) {
  //   console.log(data);
  canvasSelector = options.canvasSelector || 'svg';
  var svg = d3.select(canvasSelector),
    width = svg.attr('width'),
    height = svg.attr('height'),
    margin = options.margin || 0,
    radius = Math.min(width, height) / 2;

  var g = svg
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  // Step 4
  var ordScale = d3
    .scaleOrdinal()
    .domain(data)
    .range(['#ffd384', '#94ebcd', '#fbaccc', '#d3e0ea', '#fa7f72']);

  // Step 5
  var pie = d3.pie().value(function (d) {
    return d[options.valueKey || 'value'];
  });

  var arc = g.selectAll('arc').data(pie(data)).enter();

  // Step 6
  var path = d3.arc().outerRadius(radius).innerRadius(0);

  arc
    .append('path')
    .attr('d', path)
    .attr('fill', function (d) {
      return ordScale(d.data[options.labelKey || 'label']);
    });

  // Step 7
  var label = d3.arc().outerRadius(radius).innerRadius(0);

  arc
    .append('text')
    .attr('transform', function (d) {
      return 'translate(' + label.centroid(d) + ')';
    })
    .text(function (d) {
      return d.data[options.labelKey || 'label'];
    })
    .style('font-family', 'arial')
    .style('font-size', 15);
}
