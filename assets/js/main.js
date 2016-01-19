/**
* waypoint
* https://github.com/imakewebthings/waypoints
*/
var $head = $( 'header' );
$('.header-waypoint').each( function(i) {
	var $el = $( this ),
		animClassDown = $el.data( 'animateDown' ),
		animClassUp = $el.data( 'animateUp' );
	$el.waypoint( function( direction ) {
		if( direction === 'down' && animClassDown ) {
			$head.attr('class', 'header ' + animClassDown);
		}
		else if( direction === 'up' && animClassUp ){
			$head.attr('class', 'header ' + animClassUp);
		}
	}, { offset: '-40%' } );
});


/**
* fittext
* https://github.com/davatron5000/FitText.js
*/
$('.parallax-window h1').fitText(1.50);
// $('.release-title').fitText(1.25);
// $('.release-description').fitText(2.00);


/**
* layzr.js
* http://callmecavs.github.io/layzr.js/
*/
var layzr = new Layzr({
	// container: null,
	// selector: '[data-layzr]',
	// attr: 'data-layzr',
	// retinaAttr: 'data-layzr-retina',
	// bgAttr: 'data-layzr-bg',
	// hiddenAttr: 'data-layzr-hidden',
	// threshold: 0,
	// callback: null
});


/**
* holder.js
* https://github.com/imsky/holder
*/



