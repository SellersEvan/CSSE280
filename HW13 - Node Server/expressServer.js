const express = require( "express" );
var app = express();

app.use( "/static", express.static( "public" ) );

app.get( "/hello", ( req, res ) => {
    let name = req.query.name;
    let age  = req.query.age;
    res.send( `<h1>Hello, ${name}!</h1><p>You are ${age} years old.<p>` );
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

app.listen( 3000 );