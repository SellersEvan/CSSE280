AOS.init({
    easing: 'ease-out-cubic',
    once: true,
    offset: 50
});

window.addEventListener( "scroll", ( event ) => {
    if ( this.scrollY >= 100 ) {
        document.querySelector( ".navigation" ).classList.add( "shadow" );
    } else {
        document.querySelector( ".navigation" ).classList.remove( "shadow" );
    }
});
