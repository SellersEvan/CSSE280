/*
 *   Edited by Evan Sellers <sellersew@gmail.com> on
 *   behalf of Rose-Hulman Institute of Technology
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Thu Mar 25 2021
 *   original: N/A
 *   file: modal.js
 *   project: Personal Portfolio
 *   purpose: Modal Class
 *
 */


class modal {

    /** Init Model
     *  Initizlize the model class and build the shade
     */
    static init() {
        let shadeElm = document.createElement( "div" );
        shadeElm.classList.add( "modal-shade" );
        shadeElm.classList.add( "fade" );
        document.body.appendChild( shadeElm );
        document.getElementsByClassName( "modal-shade" )[ 0 ]
            .addEventListener( "click", () => {
                this.close();
        });
        document.querySelectorAll( ".open-modal" ).forEach( ( element ) => {
            element.addEventListener( "click", () => {
                this.open( element.dataset[ "modal" ] )
            });
        });
    }


    /** Show Shade
     *  Open the shade with an animation
     */
    static show() {
        let shadeElm = document.getElementsByClassName( "modal-shade" );
        if ( shadeElm.length != 1 ) {
            console.error( "More than one element with modal-shade class" );
        } else {
            shadeElm = shadeElm[ 0 ];
            shadeElm.classList.add( "show" );
        }
    }

    /** Hide Shade
     *  Close the shade with an animation
     */
    static hide() {
        let shadeElm = document.getElementsByClassName( "modal-shade" );
        if ( shadeElm.length != 1 ) {
            console.error( "More than one element with modal-shade class" );
        } else {
            shadeElm = shadeElm[0];
            shadeElm.classList.remove( "show" );
        }
    }

    /** Open Modal
     *  @param { DOMElm } elmID ID of dom element modal to open
     */
    static open( elmID ) {
        this.show();    
        document.getElementById( elmID ).classList.add( "open" );
    }

    /** Close Modal
     *  Close all modals open
     */
    static close() {
        document.querySelectorAll( "modal.open" )[ 0 ].classList.remove( "open" );
        this.hide();
    }
}