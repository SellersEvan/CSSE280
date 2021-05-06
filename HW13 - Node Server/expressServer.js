const express = require( "express" );
var app = express();
const bodyparser = require( "body-parser" );
const fs         = require( "fs" );
const dataDir    = "./data/db.json";
let data = [];
let counter = 0;


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


app.use( "/static", express.static( "public" ) );

app.get( "/hello", ( req, res ) => {
    let name = req.query.name;
    let age  = req.query.age;
    res.send( `<h1>Hello, ${name}!</h1><p>You are ${age} years old.<p>` );
});

app.get( "/pug/history", ( req, res ) => {
    res.render( "history", { title: "Counter History", data: data } );
});

app.get( "/goodbye", ( req, res ) => {
    res.send( "<h1>Goodbye Express!</h1>" );
});


app.post( "/myPost", ( req, res ) => {
    res.send( "HTML code. Done via a post request." );
});

app.get( "/users/:username", ( req, res ) => {
    let username = req.params.username;
    res.send( `<h1>Profile for ${ username }</h1>` );
});

app.set( "views", "./views" );
app.set( "view engine", "pug" );

app.get( "/pug", ( req, res ) => {
    let array =  [
        { "name": "Bob" },
        { "name": "Dave" },
        { "name": "Jim" }
    ]
    res.render( "index", {
        "title": "hey",
        "message": "Hello There!",
        arr: array
    } )   
});


app.use( "/pug/hello", bodyparser.urlencoded( { extended: false } ) );
app.get( "/pug/hello", ( req, res ) => {
    res.render( "hello", {
        "title": "Hello Button",
        "count": counter
    }); 
});

app.post( "/pug/hello", ( req, res ) => {
    counter = req.body.count || counter;
    data.push( counter );
    saveToServer( data );
    res.redirect( "/pug/hello" );
});

app.listen( 3000 );