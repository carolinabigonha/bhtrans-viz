/**

// Carrega o arquivo `BHTRANS_ITI.TXT`
d3.tsv('data/bhtrans_publico/BHTRANS_ITI.TXT', function(data) {
  console.log( 'BHTRANS_ITI.TXT', data );
});

// Carrega o arquivo `BHTRANS_QH.TXT`
d3.tsv('data/bhtrans_publico/BHTRANS_QH.TXT', function(data) {
  console.log( 'BHTRANS_QH.TXT', data );
});

// Carrega o arquivo `BHTRANS_ITINER.TXT`
var csv2 = d3.dsv(';', 'text/plain');
csv2('data/bhtrans_publico/BHTRANS_ITINER.TXT', function(data) {
  console.log( 'BHTRANS_ITINER.TXT', data );
});

*/
