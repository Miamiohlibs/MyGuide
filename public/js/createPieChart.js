/*
 This function creates a pie chart
 It is based on the code from the following link:
 https://www.educative.io/answers/how-to-create-a-pie-chart-using-d3 (Accessed: July 1 2022)
*/

function createPieChart(data, options = {}) {
  //   Step 3: set dimensions and margins
  canvasSelector = options.canvasSelector || 'svg';
  var svg = d3.select(canvasSelector),
    chartTitle = options.chartTitle || '',
    marginTop = parseInt(options.margin.top) || 0,
    marginBottom = parseInt(options.margin.bottom) || 0,
    marginLeft = parseInt(options.margin.left) || 0,
    marginRight = parseInt(options.margin.right) || 0,
    marginX = marginLeft + marginRight,
    marginY = marginTop + marginBottom,
    halfMarginX = marginX / 2,
    halfMarginY = marginY / 2,
    width = parseInt(svg.attr('width')),
    height = parseInt(svg.attr('height')),
    marginedWidth = width - marginX,
    marginedHeight = height - marginY,
    radius = Math.min(marginedWidth, marginedHeight) / 2,
    offsetX = width + marginX,
    offsetY = height + marginY;

  if (options.hasOwnProperty('sortSlicesBySize')) {
    sortSlicesBySize = options.sortSlicesBySize;
  } else {
    sortSlicesBySize = true;
  }

  // Create Tooltip
  const tip = d3.tip();
  tip
    .attr('class', 'd3-tip')
    .offset([-8, 0])
    .html(function (d) {
      // return JSON.stringify(d.data);
      let str = '';
      for (const [key, value] of Object.entries(d.data)) {
        str += key + ': ' + value + '<br>';
      }
      return str;
    });
  svg.call(tip);

  var g = svg
    .append('g')
    .attr('transform', 'translate(' + offsetX / 2 + ',' + offsetY / 2 + ')');

  // Step 4: set scale (colors)
  var ordScale = d3
    .scaleOrdinal()
    .domain(data)
    .range(['#FFEC21', '#378AFF', '#FFA32F', '#F54F52', '#93F03B', '#9552EA']);

  // Step 5: Pie generator
  var pie = d3.pie().value(function (d) {
    return d[options.valueKey || 'value'];
  });

  if (sortSlicesBySize == false) {
    pie.sort(null);
  }

  var arc = g.selectAll('arc').data(pie(data)).enter();

  // Step 6: add color fill to each slice
  var path = d3.arc().outerRadius(radius).innerRadius(0);

  arc
    .append('path')
    .attr('d', path)
    .attr('fill', function (d) {
      return ordScale(d.data[options.labelKey || 'label']); //color
    })
    .on('mouseover.tooltip', tip.show)
    .on('mouseover.stroke', function () {
      tip.show;
      d3.select(this).attr('stroke', 'black').attr('stroke-width', '3');
    })
    .on('mouseout.tooltip', tip.hide)
    .on('mouseout.stroke', function () {
      d3.select(this).attr('stroke-width', '0');
    });

  // Step 7: add text labels to each slice
  var label = d3.arc().outerRadius(radius).innerRadius(0);

  arc
    .append('text')
    .attr('transform', function (d) {
      // https://stackoverflow.com/questions/8053424/label-outside-arc-pie-chart-d3-js
      // put the label outside the arc
      var c = label.centroid(d),
        x = c[0],
        y = c[1],
        labelr = radius * 1.07;
      // pythagorean theorem for hypotenuse
      h = Math.sqrt(x * x + y * y);
      return 'translate(' + (x / h) * labelr + ',' + (y / h) * labelr + ')';
      //   return 'translate(' + label.centroid(d) + ')';
    })
    .text(function (d) {
      return d.data[options.labelKey || 'label'];
    })
    .style('font-family', 'arial')
    .style('font-size', 15)
    .style('z-index', '100');

  // Chart Title
  svg
    .append('text')
    .attr('transform', 'translate(' + halfMarginY + ',0)') // margin/2
    .attr('x', 50)
    .attr('y', 50)
    .attr('font-size', '24px')
    .text(chartTitle);
}
