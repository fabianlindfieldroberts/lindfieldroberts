$( document ).ready(function() {

	function animateGman() {
		$('#gman').animate({  "height": "150px"}, "slow");
		$('#gman').animate({  "height": "100px"}, "slow", animateGman);
	}
	animateGman();

});

