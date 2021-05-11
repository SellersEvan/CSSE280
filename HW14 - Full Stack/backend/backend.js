const express = require( "express" );
const logger  = require( "morgan" );
const cors    = require( "cors" ); 
var app = express();
const bodyparser = require( "body-parser" );
const fs         = require( "fs" );
const dataDir    = "../data/db.json";
let data = [];

fs.readFile( dataDir, ( err, buf ) => {
    if ( err ) {
        console.log( err );
    } else {
        data = JSON.parse( buf.toString() );
        if ( data.length != 0 ) {
            counter = data[ data.length - 1 ];
        } 
    }
    console.log( "read data" );
});

function saveToServer( data ) {
    fs.writeFile( dataDir, JSON.stringify( data ), err => {
        if ( err ) {
            console.log( err );
        } else {
            console.log( "data successfully saved" );
        }
    });
}


app.use( logger( "dev" ) );
app.use( cors() );
app.set( "views", "./views" );
app.set( "view engine", "pug" );
app.use( "/api/", bodyparser.urlencoded( { extended: true } ) );
app.use( "/api/", bodyparser.json() );


// GET ALL
app.get( "/api/", ( req, res ) => {
    res.send( data );
    res.status( 200 );
    res.end();
});

// ADD
app.post( "/api/", ( req, res ) => {
    let name = req.body.name;
    let count = req.body.count;
    data.push( { "name": name, "count": count } );
    saveToServer( data );
    res.send( "POST: Successful!" );
    res.status( 200 );
    res.end();
});

// GET Single
app.get( "/api/id/:id", ( req, res ) => {
    let id = parseInt( req.params.id );
    let result = data[ id ];
    res.send( result );
    res.status( 200 );
    res.end();
});

// UPDATE Signle
app.put( "/api/id/:id", ( req, res ) => {
    let id    = parseInt( req.params.id );
    let name  = req.body.name;
    let count = req.body.count;
    data[ id ] = { "name": name, "count": count };
    saveToServer( data );
    res.send( "PUT: Successful!" );
    res.status( 200 );
    res.end();
});

// DELETE Signle
app.delete( "/api/id/:id", ( req, res ) => {
    let id = parseInt( req.params.id );
    console.log( data );
    data.splice( req.params.id, 1 );
    console.log( data );
    saveToServer( data );
    res.send( "DELETE: Successful!" );
    res.status( 200 );
    res.end();
});


app.listen( 3000 );