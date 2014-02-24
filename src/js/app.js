(function(){

  var bhtransviz = window.bhtransviz || {};
  window.bhtransviz = bhtransviz;

  // index of each node
  bhtransviz.nodes = {};

  // number of nodes
  bhtransviz.n = 0;

  // graph connections
  bhtransviz.matrix = [];

  // draws the visualization
  bhtransviz.draw = function() {

    var margin = { top: 10, right: 20, bottom: 10, left: 20 };
    var width = 600,
        height = 600;
    var grid = width/bhtransviz.n;
    var z = d3.scale.linear().domain([0, 4]).clamp(true);

    var svg = d3.select('#viz').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('class', 'routes')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

    var row = svg.selectAll(".row")
      .data(bhtransviz.matrix)
      .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + i*grid + ")"; })
      .each(row);

    // row.append("line")
    //     .attr("x2", width);

    var column = svg.selectAll(".column")
      .data(bhtransviz.matrix)
      .enter().append("g")
      .attr("class", "column")
      .attr("transform", function(d, i) { return "translate(" + i*grid + ")rotate(-90)"; });

    // column.append("line")
    //   .attr("x1", -width);

    function row(row) {
      var cell = d3.select(this).selectAll(".cell")
        .data(row.filter(function(d) {
          return d.z.length;
        }))
        .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return grid*d.x; })
        .attr("width", grid)
        .attr("height", grid)
        .style("fill-opacity", function(d) { return z(d.z.length); })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
    }

    // mouse out of cell
    function mouseover() {

    }

    // mouse out of cell
    function mouseout() {

    }

  }

  d3.json('/data/neighborhood_graph.json', function(error, data) {

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
        }
      }

      // draw visualziation
      bhtransviz.draw()

    }

  });

})();
