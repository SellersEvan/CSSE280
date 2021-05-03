const path = require( "path" );
const util = require( "util" );
const fs   = require( "fs" );

const filesDirectory = path.join( __dirname, "files" );

console.clear();
util.log( "Hello" );
util.log( filesDirectory );

// let file = path.join( filesDirectory, "coreModules.txt" );
// let text = "Hello world, written from nodejs";
// fs.writeFile( file, text, err => {
//     if ( err ) console.error( err );
//     console.log( "success" ); 
// });

let file = path.join( filesDirectory, "coreModules.txt" );
let text = "Hello world, written from nodejs";
const fileContest = fs.readFileSync( file, "UTF-8" );
console.log( "From file: ", fileContest )