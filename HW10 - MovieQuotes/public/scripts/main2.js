const AUTH_TOKEN       = "63c1ac55-cd7b-4b68-86dc-058cdaad387a";
const COLLECTION       = "MovieQuotes";
const KEY_QUOTE        = "quote";
const KEY_MOVIE        = "movie";
const KEY_AUTHOR       = "author";
const KEY_LAST_UPDATED = "lastTouched";



// got func from prof
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}


class MovieQuote {
	constructor( id, quote, movie, author ) {
		this.id     = id;
		this.quote  = quote;
		this.movie  = movie;
		this.author = author;
	}
}


class ListPageManager {

	// Constructor
	constructor( uid ) {
		this.docs   = [];
		this.socket = null;
		this.fsdb   = firebase.firestore().collection( COLLECTION );
		this.uid    = uid;
	}

	// Open Database Connection
	openDatabase( changeListener ) {
		let query = this.fsdb.orderBy( KEY_LAST_UPDATED, "desc" ).limit( 50 );
		if ( this.uid ) query = query.where( KEY_AUTHOR, "==", this.uid );
		this.socket = query.onSnapshot((querySnapshot) => {
				this.docs = querySnapshot.docs;
				if ( changeListener ) changeListener();
			});
	}

	// Close Database Connection
	closeDatabase() {
		this.socket();
	}

	// Add Quote
	add( quote, movie ) {
		this.fsdb.add({
				[ KEY_QUOTE ]: quote,
				[ KEY_MOVIE ]: movie,
				[ KEY_AUTHOR ]: iface.loginManager.uid,
				[ KEY_LAST_UPDATED ]: firebase.firestore.Timestamp.now()
			}).then( addedDoc => {
				console.log( "Doc Added: " + addedDoc.id );
			}).catch( error => {
				console.log( error );
			});
	}

	// get doc length
	get length() {
		return this.docs.length;
	}

	// get movie quote by index
	getMovieQuoteByIndex( index ) {
		let doc = this.docs[ index ];
		return new MovieQuote(
				doc.id,
				doc.get( KEY_QUOTE ),
				doc.get( KEY_MOVIE ),
				doc.get( KEY_AUTHOR )
			);
	}

}


class ListPageController {

	// custuctor
	constructor() {
		iface.ListPageManager.openDatabase( this.update );

		$( "#addQuoteDialog" ).on( "show.bs.modal", () => {
			document.querySelector( "#addQuoteDialog #inputQuote" ).value = "";
			document.querySelector( "#addQuoteDialog #inputMovie" ).value = "";
		});

		$( "#addQuoteDialog" ).on("shown.bs.modal", () => {
			document.querySelector( "#inputQuote" ).focus();
		});

		document.querySelector( "#submitAddQuote" )
			.addEventListener( "click", () => {
				iface.ListPageManager.add(
						document.querySelector( "#inputQuote" ).value,
						document.querySelector( "#inputMovie" ).value
					);
		});
	}


	// update
	update() {
		const list = document.querySelector( "#quoteListContainer" );
		list.innerHTML = "";

		for ( let i = 0; i < iface.ListPageManager.length; i++ ) {
			const movieQuote = iface.ListPageManager.getMovieQuoteByIndex( i );
			const newCard    = ListPageController._createCard( movieQuote );
			newCard.addEventListener( "click", () => {
				window.location.href = `/quote.html?id=${ movieQuote.id }`;
			});
			list.appendChild( newCard );
		}
	}

	// create card
	static _createCard( movieQuote ) {
		return htmlToElement(
			`<div id="${ movieQuote.id }" class="card">
				<div class="card-body">
					<h5 class="card-title">${ movieQuote.quote }</h5>
					<h6 class="card-subtitle mb-2 text-muted">${ movieQuote.movie }</h6>
					${ ( movieQuote.author ) ? `<p>Posted by ${ ( movieQuote.author == iface.loginManager.uid ) ? "me" : movieQuote.author }</p>` : "" }
				</div>
			</div>` );
	}

}


class DetailPageManager {

	// custructor
	constructor( movieQuoteID ) {
		this.id     = movieQuoteID;
		this.doc    = {};
		this.socket = null;
		this.fsdb   = firebase.firestore().collection( COLLECTION ).doc( movieQuoteID );
	}

	// open database
	openDatabase( changeListener ) {
		this.socket = this.fsdb.onSnapshot( _doc => {
			if ( _doc.exists ) {
				this.doc = _doc;
				changeListener();
			} else {
				console.log( "Error Finding Document" );
			}
		});
	}

	// Close Database Connection
	closeDatabase() {
		this.socket();
	}

	// get quote
	get quote() {
		return this.doc.get( KEY_QUOTE );
	}

	// get movie
	get movie() {
		return this.doc.get( KEY_MOVIE );
	}

	// get author
	get author() {
		return this.doc.get( KEY_AUTHOR );
	}

	// update movie
	update( quote, movie ) {
		if ( this.author == iface.loginManager.uid ) {
			this.fsdb.update({
				[ KEY_QUOTE ]: quote,
				[ KEY_MOVIE ]: movie,
				[ KEY_LAST_UPDATED ]: firebase.firestore.Timestamp.now(),
			}).then(() => {
				console.log( "doc updated" );
			});
		} else {
			console.log( "Permission Denieded" );
		}
	}

	// delete document
	delete() {
		if ( this.author == iface.loginManager.uid ) {
			return this.fsdb.delete();
		} else {
			console.log( "Permission Denieded" );
			return false;
		}
	}
}


class DetailPageController {

	// Constucotr
	constructor() {

		let editQuoteBtn   = document.querySelector( "#submitEditQuote" );
		let deleteQuoteBtn = document.querySelector( "#submitDeleteQuote" );

		iface.DetailPageManager.openDatabase( this.update );

		$( "#editQuoteDialog" ).on( "show.bs.modal", () => {
			this.update();
		});

		$( "#editQuoteDialog" ).on( "shown.bs.modal", () => {
			document.querySelector( "#inputQuote" ).focus();
		});

		editQuoteBtn.addEventListener( "click", () => {
			iface.DetailPageManager.update(
					document.querySelector( "#inputQuote ").value,
					document.querySelector( "#inputMovie" ).value
				);
		});

		deleteQuoteBtn.addEventListener( "click", () => {
			iface.DetailPageManager.delete().then( () => {
				window.location.href = `/list.html?uid=${ iface.loginManager.uid }`;
			});
		});
	}

	// update
	update() {
		let quote     = iface.DetailPageManager.quote;
		let movie     = iface.DetailPageManager.movie;
		let id        = iface.DetailPageManager.id;
		let author    = iface.DetailPageManager.author;
		let editFab   = document.querySelector( "#fab" );
		let dropdown  = document.querySelector( ".dropdown" );

		if ( iface.DetailPageManager.author == iface.loginManager.uid ) {
			editFab   .style.display = "block";
			dropdown  .style.display = "block";
		} else {
			editFab   .style.display = "none";
			dropdown  .style.display = "none";
		}

		document.querySelector( "#inputQuote" ).value = quote;
		document.querySelector( "#inputMovie" ).value = movie;
		const list = document.querySelector( "#quoteListContainer" );
		list.innerHTML = "";
		const newCard    = DetailPageController._createCard(
								new MovieQuote( id, quote, movie, author ) );
		list.appendChild( newCard );
	}

	// create card
	static _createCard( movieQuote ) {
		return htmlToElement(
			`<div id="${ movieQuote.id }" class="card">
				<div class="card-body">
					<h5 class="card-title">${ movieQuote.quote }</h5>
					<h6 class="card-subtitle mb-2 text-muted">${ movieQuote.movie }</h6>
					${ ( movieQuote.author ) ? `<p>Posted by ${ ( movieQuote.author == iface.loginManager.uid ) ? "me" : movieQuote.author }</p>` : "" }
				</div>
			</div>` );
	}

}

class AuthManager {

	// constructor
	constructor() {
		this.user = null;
	}

	// Start Listening
	beginListening( changeListener ) {
		firebase.auth().onAuthStateChanged( user => {
			this.user = user;
			changeListener();
		});
	}

	// Allow Signin
	signIn() {
		Rosefire.signIn( AUTH_TOKEN, ( err, rfUser ) => {
			if ( err ) {
				console.log( "Rosefire error", err );
				return;
			}

			firebase.auth().signInWithCustomToken( rfUser.token ).catch( err => {
				if ( err.code === 'auth/invalid-custom-token' ) {
					console.log( "Token Not Valid" );
				} else {
					console.log( "error", err.message );
				}
			});
		});
	}

	// Signout
	signOut() {
		firebase.auth().signOut();
	}

	// Get User ID
	get uid() {
		return this.user.uid;
	}

	// Is Signed Out (Boolean)
	get isSignedIn() {
		return !!this.user;
	}

	// Do Login Redirect
	authRedirect() {
		let isLogin = !!document.querySelector( "[page='loginPage']" );
		if ( isLogin && this.isSignedIn ) window.location.href = "/list.html";
		if ( !isLogin && !this.isSignedIn ) window.location.href = "/";
	}
}



class ControllerLoginPage {
	constructor() {
		let button = document.querySelector( "#loginButton" );
		button.addEventListener( "click", () => {
			iface.loginManager.signIn();
		});
	}
}


class Page {
	static init() {
		let isList   = document.querySelector( "[page='listPage']"   );
		let isDetail = document.querySelector( "[page='detailPage']" );
		let isLogin  = document.querySelector( "[page='loginPage']"  );

		if ( isList ) {
			let urlParams = new URLSearchParams( window.location.search );
			let uid       = urlParams.get( "uid" );
			iface.ListPageManager    = new ListPageManager( uid );
			iface.ListPageController = new ListPageController();
		}

		if ( isDetail ) {
			let urlParams = new URLSearchParams( window.location.search );
			let id        = urlParams.get( "id" );
			iface.DetailPageManager    = new DetailPageManager( id );
			iface.DetailPageController = new DetailPageController();
		}

		if ( isDetail || isList ) {
			let btnLogout    = document.querySelector( "#menuLogout" );
			let btnAllQuotes = document.querySelector( "#menuAllQuotes" );
			let btnMyQuotes  = document.querySelector( "#menuMyQuotes" );

			btnLogout.addEventListener( "click", event => {
				console.log( "Sign out" );
				iface.loginManager.signOut();
			});

			btnAllQuotes.addEventListener( "click", event => {
				window.location.href = "/list.html";
			});

			btnMyQuotes.addEventListener( "click", event => {
				window.location.href = `/list.html?uid=${ iface.loginManager.uid}`;
			});
		}

		if ( isLogin ) {
			new ControllerLoginPage();
		}
	}
}



var iface = {};
iface.loginManager = new AuthManager();
iface.loginManager.beginListening( () => {
	console.log( `Login ${ iface.loginManager.isSignedIn } : ${ (iface.loginManager.isSignedIn) ? iface.loginManager.uid : "" }` );
	iface.loginManager.authRedirect();
	Page.init();
});