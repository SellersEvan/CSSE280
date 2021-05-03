// let hello = "Hello CSSE280!";
// for ( let i = 0; i < 10; i++ )
//     setTimeout( () => console.log( hello ), i * 1000 );


let counter = 0;
setInterval( () => {
    counter++;
    console.log( "counter: ", counter );
}, 500 );