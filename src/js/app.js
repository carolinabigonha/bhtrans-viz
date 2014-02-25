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

  // draws the visualization
  bhtransviz.draw = function() {

    var margin = { top: 10, right: 20, bottom: 10, left: 20 };
    var width = 600,
        height = 600;
    var grid = width/bhtransviz.n;
    var colorScale = d3.scale.quantize()
      .domain([1, bhtransviz.max])
      .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

    var svg = d3.select('#viz').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('class', 'routes Spectral')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    svg.append('rect')
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

    var row = svg.selectAll(".row")
        .data(bhtransviz.matrix)
      .enter().append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) {
          return "translate(0," + grid*i + ")";
        }).each(drawY)

    function drawY(row) {

      var cell = d3.select(this).selectAll(".cell")
        .data(row.filter(function(d) {
          return d.z;
        }))
      .enter().append("rect")
        .attr("x", function(d) {
          return grid*d.x;
        })
        .attr("width", grid)
        .attr("height", grid)
        .attr("class", function(d) {
          return "cell " + colorScale(d.z.length);
        });
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
        bhtransviz.matrix[i] = d3.range(bhtransviz.n).map(function(j) { return {x: j, y: i, z: []}; });
      });

      for (m in data.matrix) {
        for (n in data.matrix[m]) {
          bhtransviz.matrix[m][n] = {x: m, y: n, z: data.matrix[m][n]};
          if (bhtransviz.max < data.matrix[m][n].length) { bhtransviz.max = data.matrix[m][n].length; }
        }
      }

      // draw visualziation
      bhtransviz.draw()

    }

  });

})();
