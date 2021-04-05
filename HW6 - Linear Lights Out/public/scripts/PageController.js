/*
 *   Edited by Evan Sellers <sellersew@gmail.com> on
 *   behalf of Rose-Hulman Institute of Technology
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Thu Apr 01 2021
 *   original: N/A
 *   file: PageController.js
 *   project: N/A
 *   purpose: N/A
 *
 */


class PageController {

    constructor() {
		this.game = new LinearLightsOut();

        document.querySelectorAll( ".llo-switch" ).forEach( elm => {
            elm.addEventListener( "click", () => {
                this.game.btnPressed( parseInt( elm.dataset.lloIndex ) );
                this.updateView();
            });
        });

		document.querySelector( "#llo-action-reset" )
            .addEventListener( "click", () => {
                this.game = new LinearLightsOut();
                this.updateView();
            });

		this.updateView();
	}


    updateView() {
        let dataDisplay = document.querySelector( "#llo-data-result" );
		dataDisplay.innerHTML = this.game.getState();

        document.querySelectorAll( ".llo-switch" ).forEach( elm => {
            let index = parseInt( elm.dataset.lloIndex );
            let mark  = this.game.getMark( index );
            elm.innerHTML = mark;

            if ( mark == "1" ) {
                elm.classList.add( "light-on" );
            } else {
                elm.classList.remove( "light-on" );
            }
        });
	}

}