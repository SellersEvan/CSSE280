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
		this.game = new TicTacToe();

        document.querySelectorAll( ".ttt-action-select" ).forEach( elm => {
            elm.addEventListener( "click", () => {
                this.game.btnPressed( parseInt( elm.dataset.tttIndex ) );
                this.updateView();
            });
        });

		document.querySelector( "#ttt-action-reset" )
            .addEventListener( "click", () => {
                this.game = new TicTacToe();
                this.updateView();
            });

		this.updateView();
	}


    updateView() {
        let dataDisplay = document.querySelector( "#ttt-data-result" );
		dataDisplay.innerHTML = this.game.getState();

        document.querySelectorAll( ".ttt-action-select" ).forEach( elm => {
            let index = parseInt( elm.dataset.tttIndex );
            elm.innerHTML = this.game.getMark( index );
        });
	}

}