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
    value;
    displayElmement;

    constructor( incrementBtn, decreaseBtn, resetBtn, displayElmement ) {
        incrementBtn.addEventListener( "click", () => { this.increment() } );
        decreaseBtn.addEventListener( "click", () => { this.decrease() } );
        resetBtn.addEventListener( "click", () => { this.reset() } );
        this.displayElmement = displayElmement;
        this.reset();
        this.display();
    }

    increment() {
        this.value++;
        this.display();
    }

    decrease() {
        this.value--;
        this.display();
    }

    reset() {
        this.value = 0;
        this.display();
    }

    display() {
        this.displayElmement.innerText = this.value;
    }
}