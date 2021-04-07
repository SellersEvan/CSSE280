function isStrongPassword( buffer ) {
    if ( buffer.length < 8 ) return false;
    if ( buffer.indexOf( "password" ) != -1 ) return false;
    if ( buffer.toLowerCase() == buffer ) return false;
    return true;
}


// isStrongPassword("Qwerty");         // false - Too short
// isStrongPassword("passwordQwerty")  // false - Contains "password"
// isStrongPassword("qwerty123")       // false - No uppercase characters
// isStrongPassword("Qwerty123")       // true

