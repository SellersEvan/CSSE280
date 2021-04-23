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


const COLLECTION       = "Pic";
const KEY_IMAGE        = "imageUrl";
const KEY_CAPTION      = "caption";
const KEY_LAST_UPDATED = "lastTouched";

// got func from prof
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}


class ImageItem {
	constructor( id, imageUrl, caption ) {
		this.id       = id;
		this.imageUrl = imageUrl;
		this.caption  = caption;
	}
}


class ImageListManager {

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

	// Add Image
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

	// get doc length
	get length() {
		return this.docs.length;
	}

	// get image by index
	getImageByIndex( index ) {
		let doc = this.docs[ index ];
		return new ImageItem(
				doc.id,
				doc.get( KEY_IMAGE ),
				doc.get( KEY_CAPTION )
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
		IMAGE_MANAGER.openDatabase( this.update );

		$( "#addPhotoDialog" ).on( "show.bs.modal", () => {
			document.querySelector( "#addPhotoDialog #inputImage" ).value = "";
			document.querySelector( "#addPhotoDialog #inputCaption" ).value = "";
		});

		$( "#addPhotoDialog" ).on( "shown.bs.modal", () => {
			document.querySelector( "#inputImage" ).focus();
		});

		document.querySelector( "#sumbitAddPhoto" )
			.addEventListener( "click", () => {
				IMAGE_MANAGER.add(
						document.querySelector( "#inputImage" ).value,
						document.querySelector( "#inputCaption" ).value
					);
		});
	}

	// update
	update() {
		const list = document.querySelector( "#listPage" );
		list.innerHTML = "";

		for ( let i = 0; i < IMAGE_MANAGER.length; i++ ) {
			const imageData = IMAGE_MANAGER.getImageByIndex( i );
			const newCard    = ListPageController._createCard( imageData );
			newCard.addEventListener( "click", () => {
				window.location.href = `/detail.html?id=${ imageData.id }`;
			});
			list.appendChild( newCard );
		}
	}

	// create card
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
	update( imageUrl, caption ) {
		this.fsdb.update({
			[ KEY_IMAGE ]: imageUrl,
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
			document.querySelector( "#inputImage" ).focus();
		});

		document.querySelector( "#submitEditImage" ).addEventListener( "click", () => {
			SINGLE_IMAGE_MANAGER.update(
					document.querySelector( "#inputImage ").value,
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
		document.querySelector( "#inputImage" ).value   = imageUrl;
		document.querySelector( "#inputCaption" ).value = caption;
		const list = document.querySelector( "#detailPage" );
		list.innerHTML = "";
		const newCard    = ListPageController._createCard(
								new ImageItem( id, imageUrl, caption ) );
		list.appendChild( newCard );

		// Trigger change to Bootstrap Material Input
		var e = document.createEvent( "HTMLEvents" );
		e.initEvent( "change", false, true );
		document.querySelector( "#inputImage" ).dispatchEvent( e );
		document.querySelector( "#inputCaption" ).dispatchEvent( e );
	}

	// create card
	static _createCard( movieQuote ) {
		return htmlToElement(
			`<div class="pin" id="${ imageData.id }">
				<img src="${ imageData.imageUrl }" alt="${ imageData.caption }">
		  		<p class="caption">${ imageData.caption }</p>
			</div>` );
	}

}



if ( window.location.href.includes( "detail.html" ) ) {
	let url                    = window.location.search;
	let urlParam               = new URLSearchParams( url );
 	let docID                  = urlParam.get( "id" );
	if ( !docID ) window.location.href = "/";
	var SINGLE_IMAGE_MANAGER   = new SingleImageManager( docID );
	var DETAIL_PAGE_CONTROLLER = new DetailPageController();
} else {
	var IMAGE_MANAGER         = new ImageListManager();
	var LIST_PAGE_CONTROLLER  = new ListPageController();
}