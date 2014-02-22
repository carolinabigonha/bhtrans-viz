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

    for (bus in bhtransviz.routes) {

      // bus number
      console.log("Linha: " + bhtransviz.routes[bus].key);

      for (origin in bhtransviz.routes[bus].values) {

        // origin
        console.log("Origem: " + bhtransviz.routes[bus].values[origin].key);

        // stores the previous neighborhoods
        var previous = []

        for (infoId in bhtransviz.routes[bus].values[origin].values) {

          var info = bhtransviz.routes[bus].values[origin].values[infoId];

          // get neighborhood
          var neighborhoodList = bhtransviz.neighborhood[info.NOM_LOGR];
          var neighborhood;
          if (typeof neighborhoodList !== 'undefined' && neighborhoodList.length > 0) {
            neighborhood = neighborhoodList[0];
          }
          else
          {
            continue;
          }

          // add neighborhood to previous array
          previous.push(neighborhood);


        }


      }

    }


  }

  // adds a connection from all the previous locations to 'to'
  bhtransviz.connectToPrevious = function(to, previous) {

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
