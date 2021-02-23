$(document).ready(function() {

	//////////////////////////////////////////////////////////////////
	///////////////////////// LOADING OVERLAY ////////////////////////
	//////////////////////////////////////////////////////////////////
	$("#loading_container").delay(1000).fadeOut('fast', function() {
		$("#game_container").css("display", "flex");
	});



	//////////////////////////////////////////////////////////////////
	////////////////////////////// GAME //////////////////////////////
	//////////////////////////////////////////////////////////////////
	// Constants
	var GAME_SPEED = 300 // 400; // Time for each move of the pacman in milliseconds
	var PANIC_MODE_LENGTH = 15; // Panic mode length in game intervals/steps
	var PERSON_IN_PEN_LENGTH = 5; // Number of game intervals a person waits in pen
	var SCORE_TO_WIN = 126; // Number of dots available on the game board
	var LEADER_BOARD_MAX_LENGTH = 15; // Number of people on the leader board

	// Game variables
	var gameStarted = false;
	var soundMuted = false;
	var visualsMuted = false;
	var gameClock = null; // Every interval move the pacman and other animals one step forward
	// Create the logical board
	// First parameter is height (# rows), second parameter is width (# columns)
	var board = new Board(15, 21, SCORE_TO_WIN, LEADER_BOARD_MAX_LENGTH);

	var SPAWN_ROW = board.getSpawnRow(); // Row where person spawns
	var SPAWN_COL = board.getSpawnCol(); // Col where person spawns
	var GROWTH_ROW = board.getGrowthRow(); // Row where person grows
	var GROWTH_COL = board.getGrowthCol(); // Col where person grows

	// Create the pacman/pet and the ghosts/people
	var pet = new Pet(board, 13, 1, 'guinness'); 
	// Ghosts start in the ghost pen
	var people = new Array(); 
	people.push( new Person(board, GROWTH_ROW, GROWTH_COL, 'quentin') );
	people.push( new Person(board, 5, 18, 'fabian') ); 
	people.push( new Person(board, 5, 19, 'geireann') );	

	// Handle up/down/left/right keystroke
	$( document ).keydown(function(e) {
		if (!gameStarted && [37, 38, 39, 40].includes(e.keyCode)) {
			gameStarted = true;
			// Start game
			gameClock = window.setInterval(function() {
				advanceGameOneStep();
			}, GAME_SPEED);
			// Play music
			playThemeSong();
		}
		// Stop the page from scrolling when space is keydown
		if(e.keyCode == 32) { // 32 = space
			e.preventDefault();
		}
		else if(e.keyCode == 37) { // 37 = left
			e.preventDefault();
			pet.addDirection("LEFT");
		}
		else if(e.keyCode == 38) { // 38 = up
			e.preventDefault();
			pet.addDirection("UP");
		}
		else if (e.keyCode == 39) { // 39 = right
			e.preventDefault();
			pet.addDirection("RIGHT");
		}
		else if (e.keyCode == 40) { // 40 = down
			e.preventDefault();
			pet.addDirection("DOWN");
		}
	});


	// Aadvance the game one step
	function advanceGameOneStep() {
		// Move the pet one step forward
		pet.move();
		
		// Move the people one step forward
		for (var i = 0; i < people.length; i++) {
			var OFFSET = 0;
			people[i].move(pet, OFFSET);
		}

		// Check if board is in panic mode
		if (board.isPanicMode() && board.getPanicTime() != null) {

			// Panic mode over
			if (board.getPanicTime() == PANIC_MODE_LENGTH) {
				board.endPanicMode();
			}
			// Panic mode already running
			else {
				board.incrementPanicTime();
			}
		}
		// Only increment and release if not in panic mode
		else {
			// Every 5 times game interval, release a ghost from the 
			// pen if there is one
			if (board.isPersonInPen()) {
				// Start the pen time if not yet started
				if (board.getPenTime() == null) {
					board.startPenTime();
				}
				// If pen time finished release person
				if (board.getPenTime() == PERSON_IN_PEN_LENGTH) {
					board.freeFromPen();
				}
				// Otherwise incrment pen time
				else {
					board.incrementPenTime();
				}
			}
		}

		// End the game if pet collides with person or finish
		if (board.isGameOver() || board.isGameWon()) {
			window.clearInterval(gameClock);
		}

	}

	//////////////////////////////////////////////////////////////////
	///////////////////////// AUDIO & VISUAL /////////////////////////
	//////////////////////////////////////////////////////////////////
	// Mute unmute button
	$('#mute_unmute').click( function() {
		if (soundMuted) {
			unmutePage();
			$("#mute_unmute").attr("class", "unmuted");
			soundMuted = false;
		}
		else {
			// Mute all audio
			mutePage();
			$("#mute_unmute").attr("class", "muted");
			soundMuted = true;
		}
	});
	// See unsee button
	$('#see_unsee').click( function() {
		if (visualsMuted) {
			board.unmuteVisuals();
			$("#see_unsee").attr("class", "see");
			visualsMuted = false;
		}
		else {
			// Mute all audio
			board.muteVisuals();
			$("#see_unsee").attr("class", "unsee");
			visualsMuted = true;
		}
	});



});




