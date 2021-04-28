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
	constructor( id, quote, movie ) {
		this.id    = id;
		this.quote = quote;
		this.movie = movie;
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
				querySnapshot.forEach( ( doc ) => {
						console.log( doc.data() );
					});
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
				doc.get( KEY_MOVIE )
			);
	}

}


class ListPageController {

	// custuctor
	constructor() {
		this.init();
	}

	// init
	init() {
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
				</div>
			</div>` );
	}

}

class AuthManager {

	constructor() {
		this.user = null;
	}

	beginListening( changeListener ) {
		firebase.auth().onAuthStateChanged( user => {
			this.user = user;
			changeListener();
		});
	}


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

	signOut() {
		firebase.auth().signOut();
	}

	get uid() {
		return this.user.uid;
	}

	get isSignedIn() {
		return !!this.user;
	}

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
			console.log("You are on the detail page.");
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