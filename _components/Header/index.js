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
    }, { offset: '-1px' } );
});
