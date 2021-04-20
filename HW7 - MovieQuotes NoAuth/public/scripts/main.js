/*
 *   Edited by Evan Sellers <sellersew@gmail.com> on
 *   behalf of Rose-Hulman Institute of Technology
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Apr 19 2021
 *   original: N/A
 *   file: main.js
 *   project: N/A
 *   purpose: N/A
 *
 */


const COLLECTION       = "MovieQuotes";
const KEY_QUOTE        = "quote";
const KEY_MOVIE        = "movie";
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


class MovieQuotesManager {

	// Constructor
	constructor() {
		this.docs   = [];
		this.socket = null;
		this.fsdb   = firebase.firestore().collection( COLLECTION );
	}

	// Open Database Connection
	openDatabase( changeListener ) {
		this.socket = this.fsdb.orderBy( KEY_LAST_UPDATED, "desc" )
			.limit(50).onSnapshot((querySnapshot) => {
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
		MOVIE_QUOTE_MANAGER.openDatabase( this.update );

		$( "#addQuoteDialog" ).on( "show.bs.modal", () => {
			document.querySelector( "#addQuoteDialog #inputQuote" ).value = "";
			document.querySelector( "#addQuoteDialog #inputMovie" ).value = "";
		});

		$( "#addQuoteDialog" ).on("shown.bs.modal", () => {
			document.querySelector( "#inputQuote" ).focus();
		});

		document.querySelector( "#submitAddQuote" )
			.addEventListener( "click", () => {
				MOVIE_QUOTE_MANAGER.add(
						document.querySelector( "#inputQuote" ).value,
						document.querySelector( "#inputMovie" ).value
					);
		});
	}

	// update
	update() {
		const list = document.querySelector( "#quoteListContainer" );
		list.innerHTML = "";

		for ( let i = 0; i < MOVIE_QUOTE_MANAGER.length; i++ ) {
			const movieQuote = MOVIE_QUOTE_MANAGER.getMovieQuoteByIndex( i );
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


class SingleMovieQuotesManager {

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

	// update movie
	update( quote, movie ) {
		this.fsdb.update({
			[ KEY_QUOTE ]: quote,
			[ KEY_MOVIE ]: movie,
			[ KEY_LAST_UPDATED ]: firebase.firestore.Timestamp.now(),
		}).then(() => {
			console.log( "doc updated" );
		});
	}

	// delete document
	delete() {
		return this.fsdb.delete();
	}
}


class DetailPageController {

	// Constucotr
	constructor() {
		this.init();
	}

	// init
	init() {
		SINGLE_MOVIE_QUOTES_MANAGER.openDatabase( this.update );

		$( "#editQuoteDialog" ).on( "show.bs.modal", () => {
			this.update();
		});

		$( "#editQuoteDialog" ).on( "shown.bs.modal", () => {
			document.querySelector( "#inputQuote" ).focus();
		});

		document.querySelector( "#submitEditQuote" ).addEventListener( "click", () => {
			SINGLE_MOVIE_QUOTES_MANAGER.update(
					document.querySelector( "#inputQuote ").value,
					document.querySelector( "#inputMovie" ).value
				);
		});

		document.querySelector( "#submitDeleteQuote" ).addEventListener( "click", () => {
			SINGLE_MOVIE_QUOTES_MANAGER.delete().then( () => {
				window.location.href = "/";
			});
		});
	}

	// update
	update() {
		let quote = SINGLE_MOVIE_QUOTES_MANAGER.quote;
		let movie = SINGLE_MOVIE_QUOTES_MANAGER.movie;
		let id    = SINGLE_MOVIE_QUOTES_MANAGER.id;
		document.querySelector( "#inputQuote" ).value = quote;
		document.querySelector( "#inputMovie" ).value = movie;
		const list = document.querySelector( "#quoteListContainer" );
		list.innerHTML = "";
		const newCard    = ListPageController._createCard(
								new MovieQuote( id, quote, movie ) );
		list.appendChild( newCard );
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


if ( window.location.href.includes( "quote.html" ) ) {
	let url                         = window.location.search;
	let urlParam                    = new URLSearchParams( url );
 	let docID                       = urlParam.get( "id" );
	if ( !docID ) window.location.href = "/";
	var SINGLE_MOVIE_QUOTES_MANAGER = new SingleMovieQuotesManager( docID );
	var DETAIL_PAGE_CONTROLLER      = new DetailPageController();
} else {
	var MOVIE_QUOTE_MANAGER         = new MovieQuotesManager();
	var LIST_PAGE_CONTROLLER        = new ListPageController();
}