/*
 *   Edited by Evan Sellers <sellersew@gmail.com> on
 *   behalf of Rose-Hulman Institute of Technology
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Fri Apr 23 2021
 *   original: N/A
 *   file: main.js
 *   project: N/A
 *   purpose: N/A
 *
 */


const COLLECTION       = "Pic";													// Firestore Collection ID
const KEY_IMAGE        = "imageUrl";											// Firestore Document Key for Image Url
const KEY_CAPTION      = "caption";												// Firestore Document Key for Caption
const KEY_LAST_UPDATED = "lastTouched";											// Firestore Document Key for Last Updated


// Generate Html Element
function htmlToElement(html) {
	var template = document.createElement( "template" );
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}


// Image Class
class ImageItem {
	constructor( id, imageUrl, caption ) {
		this.id       = id;
		this.imageUrl = imageUrl;
		this.caption  = caption;
	}
}


// Main Page Manager (w/ list of all images)
class ImageListManager {

	/**
     *  Class Custructor
     *  Setup the documents and connect to the collection
     */
	constructor() {
		this.docs   = [];
		this.socket = null;
		this.fsdb   = firebase.firestore().collection( COLLECTION );
	}

	
    /** Open Database
     *  Will open the database based on the collection, and if a function is
     *  passed as a varible will 
     *  @param { Function } callback called on event trigger
     */
	openDatabase( callback ) {
		this.socket = this.fsdb.orderBy( KEY_LAST_UPDATED, "desc" )
			.limit( 50 ).onSnapshot( ( querySnapshot ) => {
				this.docs = querySnapshot.docs;
				if ( callback ) callback();
			});
	}

	
    /** Close Database
     *  Will close the database connection
     */
	closeDatabase() {
		this.socket();
	}

	
    /** Add Image
     *  Will add an image to the database
     *  @param { String } imageUrl is the url link to existing image
     *  @param { String } caption is the text for the image
     */
	add( imageUrl, caption ) {
		this.fsdb.add({
				[ KEY_IMAGE ]: imageUrl,
				[ KEY_CAPTION ]: caption,
				[ KEY_LAST_UPDATED ]: firebase.firestore.Timestamp.now()
			}).then( addedDoc => {
				console.log( "Doc Added: " + addedDoc.id );
			}).catch( error => {
				console.log( error );
			});
	}

	
    /** Get Length
     *  Will return the total amount of documents in the database
     */
	get length() {
		return this.docs.length;
	}

	
    /** Get Image By Index
     *  @param { int } index of documetn
     *  @returns { ImageItem } Image Item With data
     */
	getImageByIndex( index ) {
		let doc = this.docs[ index ];
		return new ImageItem(
				doc.id,
				doc.get( KEY_IMAGE ),
				doc.get( KEY_CAPTION )
			);
	}

}


// Main Page Controller (w/ list of all images)
class ListPageController {

	/** Constructor
	 */
	constructor() {
		this.init();
	}

	
	/** Init
	 *  Will set all the listener events and open the database
	 */
	init() {
		LIST_IMAGE_MANAGER.openDatabase( this.update.bind( this ) );

		$( "#addPhotoDialog" ).on( "show.bs.modal", () => {
			document.querySelector( "#inputImage" ).value   = "";
			document.querySelector( "#inputCaption" ).value = "";
		});

		$( "#addPhotoDialog" ).on( "shown.bs.modal", () => {
			document.querySelector( "#inputImage" ).focus();
		});

		document.querySelector( "#sumbitAddPhoto" )
				.addEventListener( "click", () => { LIST_IMAGE_MANAGER.add(
						document.querySelector( "#inputImage" ).value,
						document.querySelector( "#inputCaption" ).value
					)});
	}


	/** Update
	 *  Will be called and trigged when ever data needs to be updated
	 */
	update() {
		const list = document.querySelector( "#listPage" );
		list.innerHTML = "";

		for ( let i = 0; i < LIST_IMAGE_MANAGER.length; i++ ) {
			const imageData = LIST_IMAGE_MANAGER.getImageByIndex( i );
			const newCard    = ListPageController._createCard( imageData );
			newCard.addEventListener( "click", () => {
				window.location.href = `/pic.html?id=${ imageData.id }`;
			});
			list.appendChild( newCard );
		}
	}

	
	/** Create Card
	 *  @param { ImageData } imageData object contining properties
	 *  @returns { HTMLElement } data to be placed
	 */
	static _createCard( imageData ) {
		return htmlToElement(
			`<div class="pin" id="${ imageData.id }">
				<img src="${ imageData.imageUrl }" alt="${ imageData.caption }">
		  		<p class="caption">${ imageData.caption }</p>
			</div>` );
	}

}


class SingleImageManager {

	// custructor
	constructor( ImageID ) {
		this.id     = ImageID;
		this.doc    = {};
		this.socket = null;
		this.fsdb   = firebase.firestore().collection( COLLECTION ).doc( ImageID );
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

	// get Image Url
	get imageUrl() {
		return this.doc.get( KEY_IMAGE );
	}

	// get caption
	get caption() {
		return this.doc.get( KEY_CAPTION );
	}

	// update image
	update( caption ) {
		this.fsdb.update({
			[ KEY_CAPTION ]: caption,
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
		SINGLE_IMAGE_MANAGER.openDatabase( this.update );

		$( "#editImageDialog" ).on( "show.bs.modal", () => {
			this.update();
		});

		$( "#editImageDialog" ).on( "shown.bs.modal", () => {
			document.querySelector( "#inputCaption" ).focus();
		});

		document.querySelector( "#submitEditImage" ).addEventListener( "click", () => {
			SINGLE_IMAGE_MANAGER.update(
					document.querySelector( "#inputCaption" ).value
				);
		});

		document.querySelector( "#submitDeleteImage" ).addEventListener( "click", () => {
			SINGLE_IMAGE_MANAGER.delete().then( () => {
				window.location.href = "/";
			});
		});
	}

	// update
	update() {
		let imageUrl = SINGLE_IMAGE_MANAGER.imageUrl;
		let caption  = SINGLE_IMAGE_MANAGER.caption;
		let id       = SINGLE_IMAGE_MANAGER.id;
		document.querySelector( "#inputCaption" ).value = caption;
		const list = document.querySelector( "#detailPage" );
		list.innerHTML = "";
		const newCard    = DetailPageController._createCard(
								new ImageItem( id, imageUrl, caption ) );
		list.appendChild( newCard );

		// Trigger change to Bootstrap Material Input
		var e = document.createEvent( "HTMLEvents" );
		e.initEvent( "change", false, true );
		document.querySelector( "#inputCaption" ).dispatchEvent( e );
	}

	// create card
	static _createCard( imageData ) {
		return htmlToElement(
			`<div class="pin" id="${ imageData.id }" data-toggle="modal" data-target="#editImageDialog">
				<img src="${ imageData.imageUrl }" alt="${ imageData.caption }">
		  		<p class="caption">${ imageData.caption }</p>
			</div>` );
	}

}



if ( window.location.href.includes( "pic.html" ) ) {
	let url                    = window.location.search;
	let urlParam               = new URLSearchParams( url );
 	let docID                  = urlParam.get( "id" );
	if ( !docID ) window.location.href = "/";
	var SINGLE_IMAGE_MANAGER   = new SingleImageManager( docID );
	var DETAIL_PAGE_CONTROLLER = new DetailPageController();
} else {
	var LIST_IMAGE_MANAGER    = new ImageListManager();
	var LIST_PAGE_CONTROLLER  = new ListPageController();
}