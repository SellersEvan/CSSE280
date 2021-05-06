/*
 *   Edited by Evan Sellers <sellersew@gmail.com> on
 *   behalf of Rose-Hulman Institute of Technology
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Tue Mar 16 2021
 *   original: N/A
 *   file: counter.js
 *   project: N/A
 *   purpose: N/A
 *
 */


class counter {
    displayElmement;

    constructor( incrementBtn, decreaseBtn, resetBtn, displayElmement ) {
        incrementBtn.addEventListener( "click", () => { this.increment() } );
        decreaseBtn.addEventListener( "click", () => { this.decrease() } );
        resetBtn.addEventListener( "click", () => { this.reset() } );
        this.displayElmement = displayElmement;
    }

    getValue() {
        return parseInt( this.displayElmement.innerText );
    }

    increment() {
        this.display( this.getValue() + 1 );
    }

    decrease() {
        this.display( this.getValue() - 1 );
    }

    reset() {
        this.display( 0 );
    }

    display( value ) {
        this.displayElmement.innerText = value;
    }
}