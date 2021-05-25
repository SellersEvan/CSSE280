/*
 *   Copyright (C) 2021 Sellers Industry - All Rights Reserved
 *   Unauthorized copying of this file, via any medium is strictly
 *   prohibited. Proprietary and confidential.
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon May 24 2021
 *   file: main.js
 *   project: N/A
 *   purpose: N/A
 *
 */


const serverAPI = "http://localhost:3000/api/"

class Controller {

	// Setup Varibles
	constructor() {
		this.dataButtonState     = document.querySelector( "#dataButtonState" );
		this.dataLedStateRed     = document.querySelector( "#dataLedStateRed" );
		this.dataLedStateYellow  = document.querySelector( "#dataLedStateYellow" );
		this.dataLedStateGreen   = document.querySelector( "#dataLedStateGreen" );
		this.inputLedStateRed    = document.querySelector( "#inputLedStateRed" );
		this.inputLedStateYellow = document.querySelector( "#inputLedStateYellow" );
		this.inputLedStateGreen  = document.querySelector( "#inputLedStateGreen" );
		this.dataJoint1          = document.querySelector( "#dataJoint1" );
		this.dataJoint2          = document.querySelector( "#dataJoint2" );
		this.dataJoint3          = document.querySelector( "#dataJoint3" );
		this.inputJoint1         = document.querySelector( "#inputJoint1" );
		this.inputJoint2         = document.querySelector( "#inputJoint2" );
		this.inputJoint3         = document.querySelector( "#inputJoint3" );
		this.actionUpdateServos  = document.querySelector( "#actionSetServos" );
		this.actionRefreshStatus = document.querySelector( "#actionRefreshStatus" );

		this.init();
	}


	// Init
	init() {
		this.getStatus();

		this.actionRefreshStatus.addEventListener( "click", () => {
			this.getStatus();
		});

		this.inputLedStateRed.addEventListener( "change", () => {
			this.updateLeds( "red", this.oneOrZero( this.inputLedStateRed.checked ) );
		});

		this.inputLedStateYellow.addEventListener( "change", () => {
			this.updateLeds( "yellow", this.oneOrZero( this.inputLedStateYellow.checked ) );
		});

		this.inputLedStateGreen.addEventListener( "change", () => {
			this.updateLeds( "green", this.oneOrZero( this.inputLedStateGreen.checked ) );
		});

		this.actionUpdateServos.addEventListener( "click", () => {
			this.updateServos( [ 
					this.inputJoint1.value,
					this.inputJoint2.value,
					this.inputJoint3.value
			 	]);
		});
	}


	// Get String for LOW or HIGH based on input number 1=>High 0=>Low
	highOrLow( input ) {
		return ( input == 1 ) ? "HIGH" : "LOW";
	}


	// Get Boolean for LOW or HIGH based on input number 1=>true 0=>false
	trueOrFalse( input ) {
		return ( input == 1 ) ? true : false;
	}


	// Get Boolean for LOW or HIGH based on input number true=>1 false=>0
	oneOrZero( input ) {
		return ( input === true ) ? 1 : 0;
	}


	// Update Servos with Server
	updateServos( angles ) {
		fetch( serverAPI + "setservos/", {
			"method": "POST",
			"headers": { "Content-Type": "application/json" },
			"body": JSON.stringify( { "angles": angles } )
		}).then( () => { this.getStatus() } ).catch( err => console.log( err ) );
	}


	// Update LED with server
	updateLeds( color, status ) {
		fetch( serverAPI + "setled/" + color + "/" + status, {
			"method": "PUT"
		}).then( () => { this.getStatus() } ).catch( err => console.log( err ) );
	}


	// Get Status and update all display values
	getStatus() {
		fetch( serverAPI + "getstatus" ).then( data => {
			return data.json();
		}).then( data => {
			this.dataButtonState.innerHTML    = this.highOrLow( data[ "button" ] );

			this.dataLedStateRed.innerHTML    = this.highOrLow( data[ "leds" ][ "red" ] );
			this.dataLedStateYellow.innerHTML = this.highOrLow( data[ "leds" ][ "yellow" ] );
			this.dataLedStateGreen.innerHTML  = this.highOrLow( data[ "leds" ][ "green" ] );

			this.dataJoint1.innerHTML = data[ "servos" ][ 0 ];
			this.dataJoint2.innerHTML = data[ "servos" ][ 1 ];
			this.dataJoint3.innerHTML = data[ "servos" ][ 2 ];

			this.inputJoint1.value = data[ "servos" ][ 0 ];
			this.inputJoint2.value = data[ "servos" ][ 1 ];
			this.inputJoint3.value = data[ "servos" ][ 2 ];

			this.inputLedStateRed.checked    = this.trueOrFalse( data[ "leds" ][ "red" ] );
			this.inputLedStateYellow.checked = this.trueOrFalse( data[ "leds" ][ "yellow" ] );
			this.inputLedStateGreen.checked  = this.trueOrFalse( data[ "leds" ][ "green" ] );
		}).catch( err => console.log( err ) );
	}


}


new Controller();