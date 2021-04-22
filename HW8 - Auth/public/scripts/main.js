

class Authenication {

	static init() {
		this._initActionButtons();
		this._initCurrentUser();
		this._initLoginUI();
	}
	

	static _initLoginUI() {
		let ui = new firebaseui.auth.AuthUI( firebase.auth() );
		ui.start( "#firebaseui-auth-container", {
			signInSuccessUrl: '/',
			signInOptions: [
				firebase  .auth.GoogleAuthProvider   .PROVIDER_ID,
				firebase  .auth.EmailAuthProvider    .PROVIDER_ID,
				firebase  .auth.PhoneAuthProvider    .PROVIDER_ID,
				firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
			],
		});
	}

	static _initCurrentUser() {
		firebase.auth().onAuthStateChanged( user => {
			if (user) {
				console.log( `Signed In ${ user.uid }` );
				console.log( `displayName >> ${ user.displayName }` );
				console.log( `email >> ${ user.email }` );
				console.log( `photoURL >> ${ user.photoURL }` );
				console.log( `isAnonymous >> ${ user.isAnonymous }` );
				console.log( `phoneNumber >> ${ user.phoneNumber }` );
			} else {
				console.log( "No User" );
			}
		});
	}

	static _initActionButtons() {
		const dEmail       = document.querySelector( "#inputEmail" );
		const dPassword    = document.querySelector( "#inputPassword" );
		const btnCreateAct = document.querySelector( "#actionCreateAccount" );
		const btnLogin     = document.querySelector( "#actionLogin" );
		const btnLoginAnon = document.querySelector( "#actionAnonymousLogin" );
		const btnLogout    = document.querySelector( "#actionLogout" );

		// Create Account
		btnCreateAct.addEventListener( "click", () => {
			console.log( `Account Created` );
			console.log( `Email: ${ dEmail.value } Password: ${ dPassword.value }` );
			firebase.auth()
					.createUserWithEmailAndPassword( dEmail.value, dPassword.value )
					.catch( err => {
						console.log( "Err make User", err.code, err.message );
				});
		});

		// Login Existing User
		btnLogin.addEventListener( "click", () => {
			console.log( `Log Existing Account` );
			console.log( `Email: ${ dEmail.value } Password: ${ dPassword.value }` );
			firebase.auth()
					.signInWithEmailAndPassword( dEmail.value, dPassword.value )
					.catch( err => {
						console.log( "Err make User", err.code, err.message );
				});
		});

		// Login Annoymous
		btnLoginAnon.addEventListener( "click", () => {
			console.log( `Log Anonymous` );
			firebase.auth().signInAnonymously()
					.catch( err => {
						console.log( "Err make User", err.code, err.message );
				});
		});

		// Logout
		btnLogout.addEventListener( "click", () => {
			firebase.auth().signOut().then( () => {
				console.log( `Signout Success` );
			}).catch( err => {
				console.log( `Signout Failed: ${ err }` )
			});
		});
	}

}

Authenication.init();