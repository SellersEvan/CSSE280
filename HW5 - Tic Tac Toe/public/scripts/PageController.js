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