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
      .domain([1,10])
      .range(d3.range(0,9).map(function(i) { return "q" + i + "-9"; }));

    var svg = d3.select('#viz').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('class', 'routes YlGnBu');

    svg.append('rect')
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

    var column = svg.selectAll(".column")
        .data(bhtransviz.matrix)
      .enter().append("g")
        .attr("class", "column")
        .attr("transform", function(d, i) {
          return "translate(" + grid*i + ",0)";
        }).each(drawY)

    function drawY(column) {
      var cell = d3.select(this).selectAll(".cell")
        .data(column.filter(function(d) { return d.z.length > 0; }))
      .enter().append("rect")
        .attr("y", function(d) { return grid*d.y; })
        .attr("width", grid)
        .attr("height", grid)
        .attr("class", function(d) { return "cell " + d.x + "," + d.y + " " + d.z.length + " " + colorScale(d.z.length); });
    }

    //  function drawY(column) {
    //   var cell = d3.select(this).selectAll(".cell")
    //     .data(column.filter(function(d) { return d.z.length > 0; }))
    //   .enter().append("circle")
    //     .attr("cy", function(d) { return grid*d.y; })
    //     .attr("r", grid)
    //     .attr("class", function(d) { return "cell " + d.x + "," + d.y + " " + d.z.length + " " + colorScale(d.z.length); });
    // }

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
