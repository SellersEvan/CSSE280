function checkForm() {
   let errors    = [];
   let fullName  = document.querySelector( "#fullName" );
   let email     = document.querySelector( "#email" );
   let password1 = document.querySelector( "#password" );
   let password2 = document.querySelector( "#passwordConfirm" );
   let emailReg  = new RegExp( /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/ );
   let digitReg  = new RegExp( '[0-9]+' );


   fullName.classList.remove( "error" );
   email.classList.remove( "error" );
   password1.classList.remove( "error" );
   password2.classList.remove( "error" );

   if ( fullName.value.length <= 1 ) {
      errors.push( "Missing full name." );
      fullName.classList.add( "error" );
   }  

   if ( !emailReg.test( email.value ) ) {
      errors.push( "Invalid or missing email address." );
      email.classList.add( "error" );
   }

   if ( password1.value.length < 10 || password1.value.length > 20 ) {
      errors.push( "Password must be between 10 and 20 characters." );
      password1.classList.add( "error" );
   }

   if ( password1.value.toUpperCase() == password1.value ) {
      errors.push( "Password must contain at least one lowercase character." );
      password1.classList.add( "error" );
   }

   if ( password1.value.toLowerCase() == password1.value ) {
      errors.push( "Password must contain at least one uppercase character." );
      password1.classList.add( "error" );
   }

   if ( !digitReg.test( password1.value ) ) {
      errors.push( "Password must contain at least one digit." )
      password1.classList.add( "error" );
   }

   if ( password1.value != password2.value ) {
      errors.push( "Password and confirmation password don't match." );
      password1.classList.add( "error" );
   }

   let elm = "<ul>"

   errors.forEach( err => {
      elm += `<li>${ err }</li>`;
   });
   elm += "</ul>";

   document.querySelector( "#formErrors" ).innerHTML = elm;

   if ( errors.length > 0 ) {
      document.querySelector( "#formErrors" ).style.display = "block";
   } else {
      document.querySelector( "#formErrors" ).style.display = "none";
   }
}

document.getElementById("submit").addEventListener( "click", (event) => {
   checkForm();
   event.preventDefault();
});