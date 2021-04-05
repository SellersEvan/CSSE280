/*
 *   Edited by Evan Sellers <sellersew@gmail.com> on
 *   behalf of Rose-Hulman Institute of Technology
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Thu Apr 01 2021
 *   original: N/A
 *   file: LinearLightsOut.js
 *   project: N/A
 *   purpose: N/A
 *
 */


class LinearLightsOut {

	static SWITCH_COUNT = 6;
	static STATE = {
		START: "start",
		PLAYING: "playing",
		WON: "won"
	}
	static MARK = {
		ON: true,
		OFF: false
	}
	static WIN = {
		ON: "true,true,true,true,true,true",
		OFF: "false,false,false,false,false,false"
	}
	
    constructor() {
		this.state = LinearLightsOut.STATE.START;
		this.moves = 0;
		this.panel = [];

        for ( let i = 0; i < LinearLightsOut.SWITCH_COUNT - 1; i++ )
            this.panel.push( ( Math.random() < 0.5 ) ?
					LinearLightsOut.MARK.OFF :
					LinearLightsOut.MARK.ON
				);
		this.panel.push( !this.panel[ 0 ] );									// make impossible to be all one state
	}

	isGameOver() {
		return this.state == LinearLightsOut.STATE.WON;
	}

    btnPressed( btnIndex ) {
		if ( this.isGameOver() ) return;
		this.state = LinearLightsOut.STATE.PLAYING;
		this.moves++;
		this.panel[ btnIndex ] = !this.panel[ btnIndex ];
		if ( btnIndex - 1 >= 0 )
			this.panel[ btnIndex - 1 ] = !this.panel[ btnIndex - 1 ];
		if ( btnIndex + 1 < LinearLightsOut.SWITCH_COUNT )
			this.panel[ btnIndex + 1 ] = !this.panel[ btnIndex + 1 ];
		if ( this._checkGameOver() )
			this.state = LinearLightsOut.STATE.WON;
	}

    _checkGameOver() {
		if( this.panel == LinearLightsOut.WIN.ON  ) return true;
		if( this.panel == LinearLightsOut.WIN.OFF ) return true;
		return false;
	}


    getMark( btnIndex ) {
		return ( this.panel[ btnIndex ] ) ? 1 : 0;
	}


	getState() {
		if ( this.state == LinearLightsOut.STATE.START )
			return "Make the buttons match";
		if ( this.state == LinearLightsOut.STATE.PLAYING )
			return `You have take ${ this.moves } so far.`
		if ( this.state == LinearLightsOut.STATE.WON )
			return `You won in ${ this.moves } moves!`
		return this.state;
	}
}