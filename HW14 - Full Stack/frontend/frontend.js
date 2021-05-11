const express = require( "express" );
const logger  = require( "morgan" );
var app = express();
app.use( logger( "dev" ) );
app.use( "/static", express.static( "public" ) );
app.listen( 8080 );