$( document ).ready(function() {

	var stack = []; // holds all stack elements
	var free_item_locations = {};   // holds all free element locations

	var stackElements = $( '.stack_item' ).get().reverse();

	$( stackElements ).each(function() {
		stack.push(this);
	});

	// respond to a click on the stack itself
	$( 'body' ).on('click', '#stack', function() {

		// ensure that there are elements in stack
		if ( $( this ).children().length <= 0 ) {
			return false;
		}

		var element = stack.pop();

		// create a temporary clone
		var clone = $( element ).clone();
		$( clone ).css({'position': 'absolute', 'visibility': 'hidden'})
		$( clone ).find('ul').css({'display': 'inline'});
		$( clone ).appendTo( 'body' );

		var width  = pixel2Vmin( $( clone ).width() );
		var height = pixel2Vmin( $( clone ).height() );

		// remove temp clone
		$( clone ).remove();

		// continue until element can be placed
		var i = 0;
		var MAX_ITERATIONS = 500;
		while (true && i < MAX_ITERATIONS) {
			var xLoc = Math.random() * (100 - width);
			var yLoc = Math.random() * (100 - height);
			var newPosition = {t: yLoc, r: xLoc + width, b: yLoc + height, l: xLoc };

			// try another random coordinate if it doesn't work
			if (isOverlap(newPosition, free_item_locations)) {
				i++;	
				if (++i == MAX_ITERATIONS) {
					var message = 'There is no space on the page for this element, expand ' +
					 			  'the page or put another element back on the stack!'
					window.alert(message);
				}	
				continue;
			}

			// add final location to free element locations
			free_item_locations[element.id] = newPosition;

			$( element ).css({ 
				position: 'absolute',
				top: $( element ).offset().top - $("#center_container").offset().top,
				left: $( element ).offset().left - $("#center_container").offset().left,
			}).appendTo(
				'#center_container'
			).attr({ 
				class: 'free_item',
			}).animate({
				top: '-=4vmin',
			}, 100, function() {
				$( element ).animate({
					top:  yLoc + 'vmin',
					left: xLoc + 'vmin',
				}, 500, function() {
					$( element ).find( 'ul' ).show(500);
				}); 
			});
			break;
		}
	});


	// respond to a click on a free item
	$( '#center_container' ).on('click', '.free_item', function() {
		// disable animated item click from doing anything
		if ( $( this ).is(':animated') ) {
		    return false;
		}
		// return element to stack
		var free_element = this;
		$( this ).find( 'ul').hide(500, function(){
			delete free_item_locations[ $( free_element )[0].id ];
			stack.push( $( free_element )[0] );
			// reset css
			$( free_element ).prependTo('#stack');
			$( free_element ).css({
				position: '',
				top: '',
				left: '',
			});
			$( free_element ).attr({ class: 'stack_item' });
		});
	});

});

function pixel2Vmin(pixel) {
	// get viewport width
	var vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	// get viewport height
	var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	var vmin = Math.min(vw, vh);
	return (pixel / vmin) * 100;
}

function pixel2Vw(pixel) {
	// get viewport width
	var vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	return (pixel / vw) * 100;
}

function pixel2Vh(pixel) {
	// get viewport height
	var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	return (pixel / vh) * 100;
}


// is there overlap with other free floating items?
function isOverlap(stack_item, free_item_locations) {
	// check if overlaps with stack container
	var div = document.getElementById( 'stack_container' );
	var div_t_pixel = $( div ).offset().top - $("#center_container").offset().top;
	var div_t = pixel2Vmin( div_t_pixel );
	var div_b = pixel2Vmin( div_t_pixel + $( div ).height() );
	var div_l_pixel = $( div ).offset().left - $("#center_container").offset().left;
	var div_l = pixel2Vmin( div_l_pixel );
	var div_r = pixel2Vmin( div_l_pixel + $( div ).width() );

	var padding = 5; // pixels

	// note: numbers start from the top left
	if ( !(stack_item.t > div_b + padding || stack_item.b < div_t - padding || 
		   stack_item.l > div_r + padding || stack_item.r < div_l - padding) ) {
		return true;
	}

	// check if overlap with free elements
	for (var key in free_item_locations) {
		var free_item_location = free_item_locations[key];

		if ( ! (stack_item.t > free_item_location.b + padding || stack_item.b < free_item_location.t - padding || 
			    stack_item.l > free_item_location.r + padding || stack_item.r < free_item_location.l - padding) ) {
			return true; 
		}
	}
	return false;
}


