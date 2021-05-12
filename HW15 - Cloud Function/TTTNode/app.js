const express = require( "express" );
var app = express();
app.use( express.static( "public" ) );

app.get( "/api/getmove/:board", ( req, res ) => {
    let boardMap = req.params.board;
    let openLocation = getOpenLocations( boardMap );
    let nextMove = openLocation[ Math.floor( Math.random() * openLocation.length ) ];
    res.send( { "move": nextMove } );
});

function getOpenLocations(boardString) {
    const openLocations = [];
    for (var i = 0; i < boardString.length; i++) {
      if (boardString.charAt(i) == '-') {
        openLocations.push(i)
      }
    }
    return openLocations;
   }
   

app.listen( 3000 );