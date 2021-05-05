/*
 *   Edited by Evan Sellers <sellersew@gmail.com> on
 *   behalf of Rose-Hulman Institute of Technology
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Wed Apr 28 2021
 *   original: N/A
 *   file: main.js
 *   project: N/A
 *   purpose: N/A
 *
 */


const AUTH_TOKEN       = "63c1ac55-cd7b-4b68-86dc-058cdaad387a";
const COLLECTION       = "Pic";													// Firestore Collection ID
const KEY_IMAGE        = "imageUrl";											// Firestore Document Key for Image Url
const KEY_CAPTION      = "caption";												// Firestore Document Key for Caption
const KEY_AUTHOR       = "author";
const KEY_LAST_UPDATED = "lastTouched";


// got func from prof
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}


// Image Class
class ImageItem {
	constructor( id, imageUrl, caption, author  ) {
		this.id       = id;
		this.imageUrl = imageUrl;
		this.caption  = caption;
		this.author   = author;
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

	// Add Image
	add( imgURL, caption ) {
		this.fsdb.add({
				[ KEY_IMAGE ]: imgURL,
				[ KEY_CAPTION ]: caption,
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

	// get image by index
	getImageByIndex( index ) {
		let doc = this.docs[ index ];
		return new ImageItem(
				doc.id,
				doc.get( KEY_IMAGE ),
				doc.get( KEY_CAPTION ),
				doc.get( KEY_AUTHOR )
			);
	}

}


class ListPageController {

	// custuctor
	constructor() {
		iface.ListPageManager.openDatabase( this.update );

		$( "#addPhotoDialog" ).on( "show.bs.modal", () => {
			document.querySelector( "#addPhotoDialog #inputImage" ).value = "";
			document.querySelector( "#addPhotoDialog #inputCaption" ).value = "";
		});

		$( "#addPhotoDialog" ).on("shown.bs.modal", () => {
			document.querySelector( "#inputImage" ).focus();
		});

		document.querySelector( "#sumbitAddPhoto" )
			.addEventListener( "click", () => {
				iface.ListPageManager.add(
						document.querySelector( "#inputImage" ).value,
						document.querySelector( "#inputCaption" ).value
					);
		});
	}


	// update
	update() {
		const list = document.querySelector( "#imageListContainer" );
		list.innerHTML = "";

		for ( let i = 0; i < iface.ListPageManager.length; i++ ) {
			const image   = iface.ListPageManager.getImageByIndex( i );
			const newCard = ListPageController._createCard( image );
			newCard.addEventListener( "click", () => {
				window.location.href = `/image.html?id=${ image.id }`;
			});
			list.appendChild( newCard );
		}
	}

	// create card
	static _createCard( image ) {
		return htmlToElement(
			`<div class="pin" id="${ image.id }">
				<img src="${ image.imageUrl }" alt="${ image.caption }">
		  		<p class="caption">${ image.caption }</p>
				${ ( image.author ) ? `<p>Posted by ${ ( image.author == iface.loginManager.uid ) ? "me" : image.author }</p>` : "" }
			</div>` );
	}

}


class DetailPageManager {

	// custructor
	constructor( imageID ) {
		this.id     = imageID;
		this.doc    = {};
		this.socket = null;
		this.fsdb   = firebase.firestore().collection( COLLECTION ).doc( imageID );
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

	// get image URL
	get imageURL() {
		return this.doc.get( KEY_IMAGE );
	}

	// get caption
	get caption() {
		return this.doc.get( KEY_CAPTION );
	}

	// get author
	get author() {
		return this.doc.get( KEY_AUTHOR );
	}

	// update image
	update( caption ) {
		if ( this.author == iface.loginManager.uid ) {
			this.fsdb.update({
				[ KEY_CAPTION ]: caption,
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

		let editImageBtn   = document.querySelector( "#submitEditImage" );
		let deleteImageBtn = document.querySelector( "#submitDeleteImage" );

		iface.DetailPageManager.openDatabase( this.update );

		$( "#editImageDialog" ).on( "show.bs.modal", () => {
			this.update();
		});

		$( "#editImageDialog" ).on( "shown.bs.modal", () => {
			document.querySelector( "#inputCaption" ).focus();
		});

		editImageBtn.addEventListener( "click", () => {
			iface.DetailPageManager.update(
					document.querySelector( "#inputCaption" ).value
				);
		});

		deleteImageBtn.addEventListener( "click", () => {
			iface.DetailPageManager.delete().then( () => {
				window.location.href = `/list.html?uid=${ iface.loginManager.uid }`;
			});
		});
	}

	// update
	update() {
		let image     = iface.DetailPageManager.imageURL;
		let caption   = iface.DetailPageManager.caption;
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

		document.querySelector( "#inputCaption" ).value = caption;
		const list = document.querySelector( "#imageListContainer" );
		list.innerHTML = "";
		const newCard    = DetailPageController._createCard(
								new ImageItem( id, image, caption, author ) );
		list.appendChild( newCard );
	}

	// create card
	static _createCard( image ) {
		return htmlToElement(
			`<div class="pin" id="${ image.id }">
				<img src="${ image.imageUrl }" alt="${ image.caption }">
		  		<p class="caption">${ image.caption }</p>
				${ ( image.author ) ? `<p>Posted by ${ ( image.author == iface.loginManager.uid ) ? "me" : image.author }</p>` : "" }
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

		var anonymousUser = firebase.auth().currentUser;
		let ui = new firebaseui.auth.AuthUI( firebase.auth() );
		ui.start( "#firebaseui-auth-container", {
			signInFlow: 'popup',
			signInOptions: [
				firebase.auth.EmailAuthProvider.PROVIDER_ID,
				firebase.auth.PhoneAuthProvider.PROVIDER_ID,
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
			],
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
			let btnAllImages = document.querySelector( "#menuAllImages" );
			let btnMyImages  = document.querySelector( "#menuMyImages" );

			btnLogout.addEventListener( "click", event => {
				console.log( "Sign out" );
				iface.loginManager.signOut();
			});

			btnAllImages.addEventListener( "click", event => {
				window.location.href = "/list.html";
			});

			btnMyImages.addEventListener( "click", event => {
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