// The following are helper functions for manipulating the html of the page 
// Used exclusively by the board class

// Take in the coordinates of the square in the game board and
// return the type of the square
function getSquareTypeHTML(x, y) {
	// Get the relevant div
	var row = $( ".row" )[x];
	var square = $( row ).children( ".square" )[y];
	var classString = $( square ).attr("class").split(' ')[1];
	return classString;
}

// Replaces the square at (x, y) with the parameter square
function updateSquareHTML(square, x, y) {
	var rowHTML = $( ".row" )[x];
	var squareHTML = $( rowHTML ).children( ".square" )[y];
	var classString = "square " + square.toString();
	$( squareHTML ).attr("class", classString);
}

// Get the lowest score from the list of high scores
function getScoresHTML() {
	var scores = [];
	$(".leader_board_score").each(function(i) {
		scores.push(parseInt($(this).html()));
	});
	return scores;
}

function moveToPenHTML(person) {
}

function freeFromPenHTML(person) {
}

// Start panic mode visuals 
function startPanicVisualHTML() {
	let letterSquares = $(".letter");
	letterSquares.addClass("panic1");
	let panicModeInterval = setInterval(function(){
		letterSquares.toggleClass("panic1 panic2");
 	}, 200);
 	return panicModeInterval;
}
// End panic mode visuals
function endPanicVisualHTML(panicModeInterval) {
	clearInterval(panicModeInterval);
	// Ensure both panic classes are removed
	let letterSquares = $(".letter");
	letterSquares.removeClass("panic1 panic2");

}

// Update the scoreboard
function updateScoreHTML(score) {
	$("#score").html(score);
}

function displayLeaderBoardFormHTML(message) {
	$("#form_txt").prepend(message);
	$("#page_refresh_container").hide();
	$("#leader_board_form").show();
}

// Update score to say game over
// Messsage is object with two fields, message and messenger
function gameOverHTML(score, personName, message) {
	let personNameUpper = personName.charAt(0).toUpperCase() + personName.slice(1);
	$("#outcome_txt").html("K.O. by " + personNameUpper);
	$("#outcome_img").addClass(personName);
	$("#end_of_game_txt").html(message.message);
	$("#end_of_game_message").addClass(message.messenger);
	$("#score_input").val(score);
	// Show the game overlay
	$("#end_of_game_overlay").css('display', 'flex');
}

// Update score to say game won
function gameWonHTML(score, message) {
	$("#outcome_txt").html("Great Success!");
	$("#end_of_game_txt").html(message.message);
	$("#end_of_game_message").addClass(message.messenger);
	$("#score_input").val(score);
	// Show the game overlay
	$("#end_of_game_overlay").css('display', 'flex');
}

// Replaces the square at (x, y) with an empty square
function removeSquareFromHTML(x, y) {
	var rowHTML = $( ".row" )[x];
	var squareHTML = $( rowHTML ).children( ".square" )[y];
	var classString = "square empty";
	$( squareHTML ).attr("class", classString);
}

