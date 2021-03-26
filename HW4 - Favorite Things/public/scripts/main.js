


const display = $( "#favorite-number-display" )
$( ".favorite-number-action" ).each( ( index, element ) => {
	$( element ).on( "click", () => {
		let _display = display.data( "count" );
		let _amount  = $( element ).data( "count" );
		let isMulti  = $( element ).attr( "multiplication" ) !== undefined;
		let amount   = ( isMulti ) ?
					   ( _display * _amount ) : ( _display + _amount );
		display.data( "count", amount )
		display.text( `${ amount }` )
	});
});