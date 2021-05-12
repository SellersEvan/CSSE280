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

	add(word) {
		if (!word) {
			console.log("No word provided.  Ignoring request.");
			return;
		}
		console.log(`TODO: Add the word ${word} to the backend`);

		// TODO: Add your code here.

	}

	readAll() {
		console.log(`TODO: Read all the words from the backend, then update the screen.`);

		// TODO: Add your code here.

		// Hint for something you will need later in the process (after backend call(s))
		document.querySelector("#readAllOutput").innerHTML = "Results go here."
	}

	readSingle(index) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		console.log(`TODO: Read the word for index ${index} from the backend, then update the screen.`);

		// TODO: Add your code here.

		// Hint for something you will need later in the process (after backend call(s))
		document.querySelector("#readSingleOutput").innerHTML = "Result goes here"
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
		console.log(`TODO: Update the word ${word} at index ${index} on the backend.`);

		// TODO: Add your code here.

	}

	delete(index) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		console.log(`TODO: Delete the word at index ${index} from the backend.`);

		// TODO: Add your code here.

	}
}

rhit.PlayerController = class {
	constructor() {
		// Note to students, you can declare instance variables here (or later) to track the state for the game in progress.

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

		// TODO: Add your code here.

	}

	handleKeyPress(keyValue) {
		console.log(`You pressed the ${keyValue} key`);

		// TODO: Add your code here.

	}

	updateView() {
		console.log(`TODO: Update the view.`);
		// TODO: Add your code here.


		// Some hints to help you with updateView.
		// 	document.querySelector("#displayWord").innerHTML = "____";
		// 	document.querySelector("#incorrectLetters").innerHTML = "ABCDE";

		// 	const keyboardKeys = document.querySelectorAll(".key");
		// 	for (const keyboardKey of keyboardKeys) {
		// 		if (some condition based on keyboardKey.dataset.key) {
		// 			keyboardKey.style.visibility = "hidden";
		// 		} else {
		// 			keyboardKey.style.visibility = "initial";
		// 		}
		// 	}
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