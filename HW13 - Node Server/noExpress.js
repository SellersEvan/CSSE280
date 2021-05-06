const http = require( "http" );
const port = 3000;
const us   = require( "underscore" );
let abcTracker = 0;
let totalTracker = 0;

var router = {};

router.abc = ( req, res ) => {
    abcTracker++;
    totalTracker++;
    res.write( "<h1>ABC</h1>" );
}

router.xyz = ( req, res ) => {
    totalTracker++;
    res.write( "<!doctype html>\n" );
    res.write( "<html>\n" );
    res.write( "<head><title>Dice Roller</title></head>\n" );
    res.write( "<body>\n" );
    res.write( "<h1>Hello World!</h1>" );
    res.write( `<div>abcTracker = ${ abcTracker }</div>` );
    res.write( `<div>totalTracker = ${ totalTracker }</div>` );

    for ( let i = 0; i < 5; i++ ) res.write( `<p>${ us.random( 1, 6 ) }</p>` );
    res.write( "</body>\n" );
    res.write( "</html>\n" );
}

router.favicon = ( req, res ) => {
    res.writeHead( 200, { 'Content-Type': 'image/x-icon' } );
}

const handler = ( req, res ) => {
    res.statusCode = 200;
    res.setHeader( "Content-Type", "text/html" );
    if ( req.url === '/favicon.ico' ) { router.favicon( req, res ); return; }
    if ( req.url === '/abc' ) router.abc( req, res );
    if ( /^\/xyz.*/.test( req.url ) ) router.xyz( req, res );
    res.end();
};


const server = http.createServer( handler );
server.listen( port, err => {
    if ( err ) console.log( "Error: ", err );
    console.log( `Running on Port ${ port }` )
});