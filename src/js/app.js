(function(){

  var bhtransviz = window.bhtransviz || {};
  window.bhtransviz = bhtransviz;

  // index of each node
  bhtransviz.nodes = {};

  // number of nodes
  bhtransviz.n = 0;

  // graph connections
  bhtransviz.matrix = [];

  // max number of connections
  bhtransviz.max = 0;

  // draw the visualization
  bhtransviz.draw = function() {

    // variables
    var margin = { top: 10, right: 20, bottom: 10, left: 20 };
    var width = 600,
        height = 600;
    var grid = width/bhtransviz.n;

    // color scale
    var colorScale = d3.scale.quantize()
      .domain([1,10])
      .range(d3.range(0,9).map(function(i) { return 'q' + i + '-9'; }));

    // matrix
    var svg = d3.select('#viz').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('class', 'routes YlOrRd');

    svg.append('rect')
      .attr('class', 'background')
      .attr('width', width)
      .attr('height', height);

    // draws each column
    var column = svg.selectAll('.column')
        .data(bhtransviz.matrix)
      .enter().append('g')
        .attr('class', 'column')
        .attr('transform', function(d, i) {
          return 'translate(' + grid*i + ',0)';
        }).each(drawColumn);

    // legend
    var legend = d3.select('#legend').append('svg')
      .attr('width', width)
      .attr('height', 18)
      .append('g')
      .attr('class', 'legend YlOrRd');

    legend.selectAll('.legend-item')
      .data(colorScale.range())
    .enter().append('rect')
      .attr("width", 18)
      .attr("height", 18)
      .attr("x", 20)
      .attr('class', function(d) { return d; })
      .attr("transform", function(d, i) { return "translate(" + i * 20 + ", 0)"; });

    legend.append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr('class', 'legend-text')
      .text('1');

    legend.append("text")
      .attr("x", 210)
      .attr("y", 15)
      .attr('class', 'legend-text')
      .text('> 10');

    function drawColumn(column) {

      var cell = d3.select(this).selectAll('.cell')
        .data(column.filter(function(d) { return d.z.length > 0; }))
      .enter().append('rect')
        .attr('y', function(d) { return grid*d.y; })
        .attr('width', grid)
        .attr('height', grid)
        .attr('class', function(d) { return 'cell ' + colorScale(d.z.length); })
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);
    }

    function mouseover(cell) {

      // from neighborhood
      d3.select('#tooltip-from')
      .text(bhtransviz.nodes[cell.x].name);

      // to neighborhood
      d3.select('#tooltip-to')
      .text(bhtransviz.nodes[cell.y].name);

      // grouping bus lines
      var busLines = d3.nest()
        .key(function(d) { return d.COD_LINH; })
        .entries(cell.z);

      // number of lines
      d3.select('#tooltip-connections')
      .text(busLines.length);

      // bus list
      var list = d3.select('#bus-list')
        .selectAll('li')
        .data(busLines);

      // enter bus code
      list.enter()
        .append('li')
        .attr('class', 'cod-linh')
        .text(function(d) {
          return d.key;
        });

      // enter + update
      list.text(function(d) {
          return d.key;
      });

      // enter line/subline name
      list.selectAll('div')
        .data(function(d) {
          return d.values;
        })
        .enter()
        .append('div')
        .attr('class', 'nom-subl')
        .text(function(d) {
          return d.NOM_LINH + ' - ' + d.NOM_SUBL;
        });

      // exit
      list.exit().remove();

      d3.select('#detail').classed('hidden', false);
    }

    function mouseout() {
      d3.select('#detail').classed('hidden', true);
    }

  }

  d3.json('/data/graph.json', function(error, data) {

    if (error) {
      console.error(error);
    }
    else {

      // load data
      bhtransviz.nodes = data.nodes;
      bhtransviz.n = bhtransviz.nodes.length;

      // format matrix as an array of arrays
      bhtransviz.nodes.forEach(function(node, i) {
        bhtransviz.matrix[i] = d3.range(bhtransviz.n).map(function(j) { return {x: i, y: j, z: []}; });
      });

      for (m in data.matrix) {
        for (n in data.matrix[m]) {
          m = +m;
          n = +n;
          bhtransviz.matrix[n][m].z = data.matrix[m][n];
          if (bhtransviz.max < bhtransviz.matrix[n][m].z.length) { bhtransviz.max = bhtransviz.matrix[n][m].z.length; }
        }
      }

      // draw visualziation
      bhtransviz.draw()

    }

  });

})();
