var rhit = rhit || {};
const adminApiUrl = "http://localhost:3000/api/admin/";
//Reference (Note: the Admin api tells you words.  You are an admin.):
// POST   /api/admin/add      with body {"word": "..."} - Add a word to the word list
// GET    /api/admin/words    													- Get all words
// GET    /api/admin/word/:id 													- Get a single word at index
// PUT    /api/admin/word/:id with body {"word": "..."} - Update a word at index
// DELETE /api/admin/word/:id 													- Delete a word at index

const playerApiUrl = "http://localhost:3000/api/player/";
//Reference (The player api never shares the word. It is a secret.):
// GET    /api/player/numwords    											- Get the number of words
// GET    /api/player/wordlength/:id								 		- Get the length of a single word at index
// GET    /api/player/guess/:id/:letter								  - Guess a letter in a word

rhit.AdminController = class {
	constructor() {
		// Note to students, the contructor is done.  You will be implementing the methods one at a time.
		// Connect the buttons to their corresponding methods.
		document.querySelector("#addButton").onclick = (event) => {
			const createWordInput = document.querySelector("#createWordInput");
			this.add(createWordInput.value);
			createWordInput.value = "";
		};
		document.querySelector("#readAllButton").onclick = (event) => {
			this.readAll();
		};
		document.querySelector("#readSingleButton").onclick = (event) => {
			const readIndexInput = document.querySelector("#readIndexInput");
			this.readSingle(parseInt(readIndexInput.value));
			readIndexInput.value = "";
		};
		document.querySelector("#updateButton").onclick = (event) => {
			const updateIndexInput = document.querySelector("#updateIndexInput");
			const updateWordInput = document.querySelector("#updateWordInput");
			this.update(parseInt(updateIndexInput.value), updateWordInput.value);
			updateIndexInput.value = "";
			updateWordInput.value = "";
		};
		document.querySelector("#deleteButton").onclick = (event) => {
			const deleteIndexInput = document.querySelector("#deleteIndexInput");
			this.delete(parseInt(deleteIndexInput.value));
			deleteIndexInput.value = "";
		};
	}

	add( word ) {
		if (!word) {
			console.log("No word provided.  Ignoring request.");
			return;
		}
		fetch( adminApiUrl + "add", {
			"method": "POST",
			"headers": { "Content-Type": "application/json" },
			"body": JSON.stringify( { "word": word } )
		}).then( () =>  {
			console.log( `Successfully added ${ word }.` );
		}).catch( err => console.log( err ) );
	}

	readAll() {
		fetch( adminApiUrl + "words" ).then( data => {
			return data.json();
		}).then( data => {
			let result = "";
			data[ "words" ].forEach( ( word, index ) => {
				result += word;
				if ( index < data[ "words" ].length - 1 ) result += ",";
			});
			document.querySelector( "#readAllOutput" ).innerHTML = result;
		}).catch( err => console.log( err ) );
	}

	readSingle(index) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		fetch( adminApiUrl + "word/" + index ).then( data => {
			return data.json();
		}).then( data => {
			document.querySelector("#readSingleOutput").innerHTML = data[ "word" ];
		}).catch( err => console.log( err ) );
	}

	update(index, word) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		if (!word) {
			console.log("No word provided.  Ignoring request.");
			return;
		}

		fetch( adminApiUrl + "word/" + index, {
			"method": "PUT",
			"headers": { "Content-Type": "application/json" },
			"body": JSON.stringify( { "word": word } )
		}).catch( err => console.log( err ) );
	}

	delete(index) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		fetch( adminApiUrl + "word/" + index, {
			"method": "DELETE"
		}).catch( err => console.log( err ) );
	}
}

rhit.PlayerController = class {
	constructor() {
		// Connect the Keyboard inputs
		const keyboardKeys = document.querySelectorAll(".key");
		for (const keyboardKey of keyboardKeys) {
			keyboardKey.onclick = (event) => {
				this.handleKeyPress(keyboardKey.dataset.key);
			};
		}
		// Connect the new game button
		document.querySelector("#newGameButton").onclick = (event) => {
			this.handleNewGame();
		}
		this.handleNewGame(); // Start with a new game.
	}

	handleNewGame() {
		console.log(`TODO: Create a new game and update the view (after the backend calls).`);
		this.incorrect = [];
		this.correct   = [];
		this.index     = -1;
		this.length    = -1;

		fetch( playerApiUrl + "numwords/" )
			.then( data => { return data.json() } )
			.then( data => {
				this.index  = Math.floor( Math.random() * data[ "length" ] );
				fetch( playerApiUrl + "wordlength/" + this.index )
					.then( data => { return data.json() } )
					.then( data => {
						this.length = data[ "length" ];
						for ( let i = 0; i < this.length; i++ )
							this.correct.push( "_" );
						this.updateView();
					}).catch( err => console.log( err ) );
			}).catch( err => console.log( err ) );
	}

	handleKeyPress( keyValue ) {
		console.log( `You pressed the ${keyValue} key` );
		fetch( playerApiUrl + "guess/" + this.index + "/" + keyValue )
			.then( data => { return data.json() } )
			.then( data => {
				if ( data[ "locations" ].length == 0 ) {
					this.incorrect.push( data[ "letter" ] );
				} else {
					data[ "locations" ].forEach( index => {
						this.correct[ index ] = data[ "letter" ];
					});
				}
				this.updateView();
			}).catch( err => console.log( err ) );
	}



	updateView() {
		let correct   = "";
		let incorrect = "";

		this.correct.forEach( letter => { correct += letter } );
		this.incorrect.forEach( letter => { incorrect += letter } );
		document.querySelector("#displayWord").innerHTML = correct;
		document.querySelector("#incorrectLetters").innerHTML = incorrect;

		document.querySelectorAll( ".key" ).forEach( elm => {
			let key = elm.getAttribute( "data-key" );
			let useC  = this.correct.includes( key );
			let useI  = this.incorrect.includes( key );
			elm.style.visibility = ( useC || useI ) ? "hidden" : "initial";
		});

	}
}

/* Main */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#adminPage")) {
		console.log("On the admin page");
		new rhit.AdminController();
	}
	if (document.querySelector("#playerPage")) {
		console.log("On the player page");
		new rhit.PlayerController();
	}
};

rhit.main();