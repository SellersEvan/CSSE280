/*
 *   Edited by Evan Sellers <sellersew@gmail.com> on
 *   behalf of Rose-Hulman Institute of Technology
 *
 *   author: Evan Sellers <sellersew@gmail.com>
 *   date: Fri Mar 26 2021
 *   original: N/A
 *   file: main.js
 *   project: N/A
 *   purpose: N/A
 *
 */

const displayNum = $( "#favorite-number-display" )
$( ".favorite-number-action" ).each( ( index, element ) => {
	$( element ).on( "click", () => {
		let _display = displayNum.data( "count" );
		let _amount  = $( element ).data( "count" );
		let isMulti  = $( element ).attr( "multiplication" ) !== undefined;
		let amount   = ( isMulti ) ?
					   ( _display * _amount ) : ( _display + _amount );
		displayNum.data( "count", amount )
		displayNum.text( `${ amount }` )
	});
});

const displayColor = $( "#favorite-color-display" )
$( ".favorite-color-action" ).each( ( index, element ) => {
	$( element ).on( "click", () => {
		let _background  = $( element ).data( "background" );
		let _color       = $( element ).data( "color" );
		let _title       = $( element ).data( "title" );
		displayColor.css( "background-color", _background );
		displayColor.css( "color", _color );
		displayColor.text( _title );
	});
	$( element ).css( "background-color", $( element ).data( "background" ) );
});

