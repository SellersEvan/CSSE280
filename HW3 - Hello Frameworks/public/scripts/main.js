/*
 *   Edited by Evan Sellers <sellersew@gmail.com> on
 *   behalf of Rose-Hulman Institute of Technology
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Mon Mar 22 2021
 *   original: N/A
 *   file: main.js
 *   project: N/A
 *   purpose: N/A
 *
 */

const display = $( "#amount-display" )

$( ".action-manipulators" ).each( ( index, element ) => {
	$( element ).on( "click", () => {
		let _display = display.data( "amount" );
		let _amount  = $( element ).data( "amount" );
		let isMulti  = $( element ).attr( "multiplication" ) !== undefined;
		let amount   = ( isMulti ) ?
					   ( _display * _amount ) : ( _display + _amount );
		display.data( "amount", amount )
		display.text( `amount = ${ amount }` )
	});
});