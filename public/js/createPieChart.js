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
    titleFontSize = options.titleFontSize || '24px',
    labelFontSize = options.labelFontSize || '15px',
    titlePositionX = options.titlePositionX || '50',
    titlePositionY = options.titlePositionY || '50',
    marginTop = parseInt(options.margin.top) || 0,
    marginBottom = parseInt(options.margin.bottom) || 0,
    marginLeft = parseInt(options.margin.left) || 0,
    marginRight = parseInt(options.margin.right) || 0,
    marginX = marginLeft + marginRight,
    marginY = marginTop + marginBottom,
    // halfMarginX = marginX / 2,
    halfMarginY = marginY / 2,
    width = parseInt(svg.attr('width')),
    height = parseInt(svg.attr('height')),
    marginedWidth = width - marginX,
    marginedHeight = height - marginY,
    radius = Math.min(marginedWidth, marginedHeight) / 2,
    // offsetX = width + marginX,
    // offsetY = height + marginY,
    valueKey = options.valueKey || 'value';

  if (Math.min(marginedWidth, marginedHeight) == marginedWidth) {
    centerPositionX = marginLeft + radius;
    centerPositionY = marginTop + marginedHeight / 2;
  } else {
    centerPositionX = marginLeft + marginedWidth / 2;
    centerPositionY = marginTop + radius;
  }

  // get sum of all values for percentages
  var sum = data
    .map(function (d) {
      return d[valueKey];
    })
    .reduce(function (a, b) {
      return a + b;
    }, 0);
  console.log(sum);

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
      str += 'Percentage: ' + ((d.data[valueKey] / sum) * 100).toFixed(1) + '%';
      return str;
    });
  svg.call(tip);

  var g = svg
    .append('g')
    .attr(
      'transform',
      'translate(' + centerPositionX + ',' + centerPositionY + ')'
    );
  // .attr('transform', 'translate(' + offsetX / 2 + ',' + offsetY / 2 + ')');

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

  // set size of pie
  var path = d3.arc().outerRadius(radius).innerRadius(0);

  // Step 6: add color fill to each slice
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
    .style('font-size', labelFontSize)
    .style('z-index', '100');

  // Chart Title
  svg
    .append('text')
    //.attr('transform', 'translate(' + halfMarginY + ',0)')
    .attr('x', titlePositionX)
    .attr('y', titlePositionY)
    .attr('font-size', titleFontSize)
    .text(chartTitle);
}
