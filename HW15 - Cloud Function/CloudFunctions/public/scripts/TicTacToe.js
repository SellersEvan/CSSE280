/*
 *   Edited by Evan Sellers <sellersew@gmail.com> on
 *   behalf of Rose-Hulman Institute of Technology
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Thu Apr 01 2021
 *   original: N/A
 *   file: TicTacToe.js
 *   project: N/A
 *   purpose: N/A
 *
 */


class TicTacToe {

    static MARK = { 
        X: "X",
		O: "O",
		NONE: " "
	}
	static STATE = {
		X_TURN: "X's Turn",
		O_TURN: "O's Turn",
		X_WIN:  "X Wins",
		O_WIN:  "O Wins",
		TIE:    "Tie Game"
	}
	static BOARD_SIZE = 9;
    static ROW_CHECKS = [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ], [ 0, 3, 6 ],
                        [ 1, 4, 7 ], [ 2, 5, 8 ], [ 0, 4, 8 ], [ 2, 4, 6 ] ];

                        
    constructor() {
		this.state = TicTacToe.STATE.X_TURN;
		this.board = [];

        for ( let i = 0; i < TicTacToe.BOARD_SIZE; i++ )
            this.board.push( TicTacToe.MARK.NONE );

	}


    isGameOver() {
        return ( this.state == TicTacToe.STATE.X_WIN ||
			     this.state == TicTacToe.STATE.O_WIN ||
			     this.state == TicTacToe.STATE.TIE );
    }


    btnPressed( btnIndex ) {
		if ( this.isGameOver() ) return;
        if ( this.board[ btnIndex ] != TicTacToe.MARK.NONE ) return;

        if ( this.state == TicTacToe.STATE.X_TURN ) {
			this.board[ btnIndex ] = TicTacToe.MARK.X;
			this.state = TicTacToe.STATE.O_TURN;
			this._checkGameOver();
			if ( this.state == TicTacToe.STATE.O_TURN )
				this._computerTurn();
		}
	}

	_computerTurn() {
		// http://localhost:5001/sellersew-cloudfunctions/us-central1/api/getmove/
		fetch( `https://us-central1-fisherds-cloudfunctions.cloudfunctions.net/api/getmove/${ this.boardString }` )
			.then( res => {
				return res.json();
			}).then( data => {
				this.board[ data[ "move" ] ] = TicTacToe.MARK.O;
				this.state = TicTacToe.STATE.X_TURN;
				this._checkGameOver();
				document.dispatchEvent( new CustomEvent( "turnComplete" ) );
			}).catch( err => console.log( err ) );
	}


    _checkGameOver() {
		if ( !this.board.includes( TicTacToe.MARK.NONE ) ) 
			this.state = TicTacToe.STATE.TIE;
        TicTacToe.ROW_CHECKS.forEach( bx => {
            let buf = this.board[bx[0]]+this.board[bx[1]]+this.board[bx[2]];
            if ( buf == "XXX" ) this.state = TicTacToe.STATE.X_WIN;
			else if ( buf == "OOO" ) this.state = TicTacToe.STATE.O_WIN;
        });
	}


    getMark( btnIndex ) {
		return this.board[ btnIndex ];
	}


	getState() {
		return this.state;
	}


	get boardString() {
		let boardString = "";
		this.board.forEach( item => {
			if ( item == TicTacToe.MARK.NONE )
				boardString += "-";
			else
				boardString += item;
		});
		return boardString;
	}
	 
}