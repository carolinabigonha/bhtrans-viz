(function(){

  var bhtransviz = window.bhtransviz || {};
  window.bhtransviz = bhtransviz;

  // neighborhood database
  bhtransviz.neighborhood = {};

  // connection between neighborhoods
  bhtransviz.routes = {};

  // connection between neighborhoods
  bhtransviz.matrix = [];

  // connections between neigtborhoods
  bhtransviz.connections = {};

  // constructs the connection matrix
  bhtransviz.loadMatrix = function() {

    for (bus in bhtransviz.routes) {

      // bus 
      var line = bhtransviz.routes[bus].key;
      console.log("Linha: " + line);

      for (origin_id in bhtransviz.routes[bus].values) {

        // stores the previous neighborhoods
        var from = null;
        var previous = {};

        for (infoId in bhtransviz.routes[bus].values[origin_id].values) {

          var info = bhtransviz.routes[bus].values[origin_id].values[infoId];

          var neighborhood = null;

          // get neighborhood
          var neighborhood = bhtransviz.neighborhood[info.NOM_LOGR];
          if (typeof neighborhood === 'undefined'){
            console.debug("Street has no neighborhood " + info.NOM_LOGR);
            continue;
          }

          if(from == null)
          {
            from = neighborhood.value
          }

          // add neighborhood to previous array
          previous[neighborhood.value] = true;
        }

        // Add previous lines
        bhtransviz.connectPoints(from,previous,line);
      }
    }
  }

  // adds a connection from all the previous locations to 'to'
  bhtransviz.connectPoints = function(from, previous,bus) {
    var newFrom = null;
    var newPrevious = {}
    for(id in previous){

      if (newFrom === null && from !== id) {
        from = id;
      }

      bhtransviz.addConnection(from,id,bus);
      newPrevious[id] = true;
    }

    if(newPrevious.length > 1 && newFrom) {
      bhtransviz.connectPoints(previous[1],newPrevious,bus);
    }
  }

  // adds or updates matrix connections
  bhtransviz.addConnection = function(from, to, bus) {

    var conn = [];
    conn = bhtransviz.connections[from+"#"+to];
    if(conn === undefined){
      conn = [];
    }

    // conn.push(bus);
    bhtransviz.connections[from+"#"+to] = bus;

    var object = {};
    object.from = from;
    object.to = to;
    object.options = conn;

    bhtransviz.matrix.push(object);
  }

  // draws the visualization
  bhtransviz.draw = function() {
    console.log(bhtransviz.matrix);
  }

  // load neighborhood data
  d3.csv('/data/rua-bairros.csv')
    .row(function(d) { 
      var value = {key: d.LOGRADOURO, value: d.BAIRRO};
      bhtransviz.neighborhood[d.LOGRADOURO] = value;
      return value; 
    })
    .get(function(error, rows) {

      if (error) {
        console.log(error);
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
