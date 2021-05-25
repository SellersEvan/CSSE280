/*
 *   Copyright (C) 2021 Sellers Industry - All Rights Reserved
 *   Unauthorized copying of this file, via any medium is strictly
 *   prohibited. Proprietary and confidential.
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon May 24 2021
 *   file: app.js
 *   project: N/A
 *   purpose: N/A
 *
 */

const express    = require( "express" );
const bodyParser = require( "body-parser" );
const fs         = require( "fs" );
const cors       = require( "cors" );
const app        = express();


// Data from a file.
var data = {};
const serverSideStorage = "../data/db.json";
fs.readFile( serverSideStorage, ( err, buf ) => {
    if ( err ) console.error( "error: ", err );
    else data = JSON.parse( buf.toString() );
    if ( data[ "leds" ] === undefined )
        data[ "leds" ] = { "red": 0, "yellow": 0, "green": 0 };
    if ( data[ "servos" ] === undefined )
        data[ "servos" ] = [ 0, 0, 0 ];
});

function saveToServer( data ) {
    fs.writeFile( serverSideStorage, JSON.stringify( data ),  ( err, buf ) => {
        if ( err ) console.error( "error: ", err );
    });
}
function randomButtonState() { return ( Math.random() > 0.75 ) ? 1 : 0; }


app.use( cors() );
app.use( "/", express.static( "public" ) );
app.use( "/api/", bodyParser.urlencoded( { extended: true } ) );
app.use( "/api/", bodyParser.json() );


/**
 * Read button	- Gets the state of the fake pushbutton (0 or 1)
 *   method:                    GET
 *   path:                      /api/readbutton
 *   expected request body:     none
 *   side effects:              none (the pushbutton is always random)
 *   response:                  {"button": 0} or {"button": 1}
 */
app.get( "/api/readbutton", ( req, res ) => {
    res.status( 200 );
    res.json( { "button": randomButtonState() } );
    res.send();
});


/**
 *  Get Status - Get the state of all fake physical components.
 *    method:                    GET
 *    path:                      /api/getstatus
 *    expected request body:     none
 *    side effects:              none
 *    response:                  {"button": 0, "leds": {"red": 1, "yellow": 1, "green": 0},
 *                                "servos": [0, 45, 0]}
 */
app.get( "/api/getstatus", ( req, res ) => {
    res.status( 200 );
    res.json( {
            "button": randomButtonState(),
            "leds": data[ "leds" ],
            "servos": data[ "servos" ]
        });
});


/**
 * Set LED - Sets the state of 1 LED
 *   method:                    PUT
 *   path:                      /api/setled/:color/:state
 *   expected request body:     none
 *   side effects:              saves the state for this LED into db.json
 *                              prints to the console the LED states
 *   response:                  {"leds": {"red": 1, "yellow": 0, "green": 0}}
*/
app.put( "/api/setled/:color/:state", ( req, res ) => {
    data[ "leds" ][ req.params.color ] = ( parseInt( req.params.state ) > 0 ) ? 1 : 0;
    saveToServer( data );
    res.status( 201 );
    res.json( { "leds": data[ "leds" ] } );
    res.send();
});


/**
 *  Set servos - Set all three servo angles using a POST, body is a JSON array with 3 numbers.
 *    method:                    POST
 *    path:                      /api/setservos
 *    expected request body:     JSON object, for example {"angles": [-90, 90, 0]}
 *   side effects:               saves the state of the servos into db.json
 *                               prints to the console the servo states
 *    response:                  {"servos": [-90, 90, 0]}
 */
app.post( "/api/setservos", ( req, res ) => {
    data[ "servos" ] = req.body[ "angles" ];
    saveToServer( data );
    res.status( 201 );
    res.json( { "servos": data[ "servos" ] } );
    res.send();
});

app.listen( 3000, () => { console.log( "Port 3000" ) } );
