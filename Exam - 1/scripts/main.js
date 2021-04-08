



var rhit = rhit || {};

rhit.WaterPark = class {

    constructor ( gainsOfActivity ) {
        this.projectedGainsOfActivity = gainsOfActivity;
        this.resetActivity();
    }

    setStartingTickets( startingTickets ) {
        this.startingTickets = startingTickets;
    }

    resetActivity() {
        this.amountOfActivity = [];
        this.projectedGainsOfActivity.forEach( () => {
            this.amountOfActivity.push( 0 );
        });
    }

    addActivity( activityId ) {
        let gainOfActivity = this.projectedGainsOfActivity[ activityId ];
        if ( this.projectedTickets() - gainOfActivity >= 0 ) {
            this.amountOfActivity[ activityId ] += 1;
        }
    }

    getActivity( activityId ) {
        return this.amountOfActivity[ activityId ];
    }

    projectedTickets() {
        let ticketCount = this.startingTickets;
        for ( let i = 0; i < this.projectedGainsOfActivity.length; i++ ) {
            let amountOfActivity = this.amountOfActivity[ i ];
            let gainOfActivity   = this.projectedGainsOfActivity[ i ];
            ticketCount -= amountOfActivity * gainOfActivity;
        }
        return ticketCount;
    }
}

rhit.WaterParkController = class {
	constructor() {

		// Get DOM Elements
		const ticketInput = document.querySelector("#startingTicketsInput");
		const updateBtn   = document.querySelector( "#updateButton" );
		const btn1        = document.querySelector( "#option1Button" );
		const btn2        = document.querySelector( "#option2Button" );
		const btn3        = document.querySelector( "#option3Button" );
		const btn4        = document.querySelector( "#option4Button" );
		const resetBtn    = document.querySelector( "#resetButton" );
		const buttons     = [ btn1, btn2, btn3, btn4 ];

		// Get Init Values
		this.park = new rhit.WaterPark( this._getActivityValues( buttons ) );
		this.park.setStartingTickets( this._getStartTickets( ticketInput ) );

		// Update Starting Tickets
		updateBtn.addEventListener( "click", () => {
			this.park.setStartingTickets(
					this._getStartTickets( ticketInput )
				);
			this.updateView();
		});

		// Update Amount of Activity
		buttons.forEach( elm => {
			elm.addEventListener( "click", () => {
				let index = parseInt( elm.dataset[ "activity" ] ) - 1;
				this.park.addActivity( index );
				this.updateView();
			});
		});

		// Reset Activity
		resetBtn.addEventListener( "click", () => {
			this.park.resetActivity();
			this.updateView();
		});

		this.updateView();
	}


	_getActivityValues( ActivityButtons ) {
		let activityValue = [];
		ActivityButtons.forEach( btn => {
			activityValue.push( parseInt( btn.dataset[ "cost" ] ) )
		});
		return activityValue;
	}

	_getStartTickets( startingTicketsInput ) {
		return parseInt( startingTicketsInput.value );
	}





	// TODO: Add methods as needed

	updateView() {
		const counterDisplay1 = document.querySelector("#option1Counter");
		const counterDisplay2 = document.querySelector("#option2Counter");
		const counterDisplay3 = document.querySelector("#option3Counter");
		const counterDisplay4 = document.querySelector("#option4Counter");
		const ticketsRemainingDisplay = document.querySelector("#ticketsRemaining");

		// Optionally you can use an array of text output elements.
		const counterDisplays = [ counterDisplay1, counterDisplay2, counterDisplay3, counterDisplay4 ];

		// TODO: Add code to updateView as needed
		ticketsRemainingDisplay.innerHTML = this.park.projectedTickets();
		counterDisplay1.innerHTML         = this.park.getActivity( 0 );
		counterDisplay2.innerHTML         = this.park.getActivity( 1 );
		counterDisplay3.innerHTML         = this.park.getActivity( 2 );
		counterDisplay4.innerHTML         = this.park.getActivity( 3 );
	}
}

/* Main */
rhit.main = function () {
	console.log("Ready");
	new rhit.WaterParkController();
};

rhit.main();