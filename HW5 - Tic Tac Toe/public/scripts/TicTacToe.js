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
		} else if ( this.state == TicTacToe.STATE.O_TURN ) {
			this.board[ btnIndex ] = TicTacToe.MARK.O;
			this.state = TicTacToe.STATE.X_TURN;
		}

		this._checkGameOver();
	}


    _checkGameOver() {
		if ( !this.board.includes( TicTacToe.MARK.NONE ) ) 
			this.state = TicTacToe.State.TIE;

        

        // update
		const linesOf3 = [];
		linesOf3.push(this.board[0] + this.board[1] + this.board[2]);
		linesOf3.push(this.board[3] + this.board[4] + this.board[5]);
		linesOf3.push(this.board[6] + this.board[7] + this.board[8]);
		linesOf3.push(this.board[0] + this.board[3] + this.board[6]);
		linesOf3.push(this.board[1] + this.board[4] + this.board[7]);
		linesOf3.push(this.board[2] + this.board[5] + this.board[8]);
		linesOf3.push(this.board[0] + this.board[4] + this.board[8]);
		linesOf3.push(this.board[2] + this.board[4] + this.board[6]);
		for (const lineOf3 of linesOf3) {
			if (lineOf3 == "XXX") {
				this.state = TicTacToe.STATE.X_WIN;
			} else if (lineOf3 == "OOO") {
				this.state = TicTacToe.STATE.O_WIN;
			}
		}
	}


    getMark( btnIndex ) {
		return this.board[ btnIndex ];
	}

	getState() {
		return this.state;
	}

}