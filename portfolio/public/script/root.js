/*
 *   Edited by Evan Sellers <sellersew@gmail.com> on
 *   behalf of Rose-Hulman Institute of Technology
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Thu Mar 25 2021
 *   original: N/A
 *   file: _root.js
 *   project: N/A
 *   purpose: N/A
 *
 */


// Scroll Navbar
window.addEventListener( "scroll", ( event ) => {
    if ( this.scrollY >= 100 ) {
        document.querySelector( ".navigation" ).classList.add( "shadow" );
    } else {
        document.querySelector( ".navigation" ).classList.remove( "shadow" );
    }
});

// Modal Startup
modal.init();