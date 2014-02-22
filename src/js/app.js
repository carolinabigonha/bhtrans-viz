(function(){

  var bhtransviz = window.bhtransviz || {};
  window.bhtransviz = bhtransviz;

  // neighborhood database
  bhtransviz.neighborhood = {};

  // connection between neighborhoods
  bhtransviz.routes = {};

  // connection between neighborhoods
  bhtransviz.matrix = {};

  // constructs the connection matrix
  bhtransviz.loadMatrix = function() {
    console.log(bhtransviz.routes);
  }

  // adds or updates matrix connections
  bhtransviz.addConnection = function(from, to, bus) {

    // create new key if origin is not in the matrix
    if (!from in bhtransviz.matrix.keys()) {
      bhtransviz.matrix[from] = {};
    }

    // creates a new array if it's the first connection between
    // origin and destination
    if (!to in bhtransviz.matrix[from].keys()) {
      bhtransviz.matrix[from][to] = [];
    }

    // append connection
    bhtransviz.matrix[from][to].push(bus);
  }

  // draws the visualization
  bhtransviz.draw = function() {
    console.log(bhtransviz.matrix);
  }

  // load neighborhood data
  d3.csv('/data/rua-bairros.csv')
    .row(function(d) { return {key: d.LOGRADOURO, value: d.BAIRRO}; })
    .get(function(error, rows) {

      if (error) {
        console.log(error);
      }
      else {
        bhtransviz.neighborhood = rows;
      }

  });

  // load routes
  d3.tsv('/data/bhtrans_publico/BHTRANS_ITI.TXT', function(error, data) {

    if (error) {
      console.log(error);
    }
    else {

      // nest routes by bus line
      bhtransviz.routes = d3.nest()
        .key(function(d) { return d.COD_LINH; })
        .key(function(d) { return d.NUM_PONT_CTRL_ORIG; })
        .entries(data);

      // load matrix of connections
      bhtransviz.loadMatrix();

      // draw visualization
      bhtransviz.draw();
    }

  });

})();
