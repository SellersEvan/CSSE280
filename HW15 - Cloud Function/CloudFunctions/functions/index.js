const functions = require("firebase-functions");
const express   = require( "express" );
const cors      = require( "cors" );
const app       = express();

app.use( cors( { origin: true } ) );


app.get( "/getmove/:board", ( req, res ) => {
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

exports.api = functions.https.onRequest( app );
