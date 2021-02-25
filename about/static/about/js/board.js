// Class for the logical representation of the Pacman game board
class Board {

	constructor(height, width, scoreToWin, leaderBoardMaxLength) {

		this.height = height;
		this.width = width;
		this.scoreToWin = scoreToWin;
		this.leaderBoardMaxLength = leaderBoardMaxLength;

		// i represents each row, j represents each column in the row
		this.board = new Array(this.height);
		for (var i = 0; i < this.height; i++) { 
			this.board[i] = new Array(this.width); 
			// For each item in the row, add a square object
			for (var j = 0; j < this.width; j++) {
				// Get the current type of the square
				// Initially, there are no animals on the board
				var squareType = getSquareTypeHTML(i, j);
				// Create the square
				if (squareType == "wall") {
					this.board[i][j] = new Wall(this, "wall");
				}
				else if (squareType == "dot") {
					this.board[i][j] = new Dot(this, "dot");
				}
				else if (squareType == "energizer") {
					this.board[i][j] = new Energizer(this, "energizer");
				}
				else if (squareType == "empty") {
					this.board[i][j] = new Empty(this, "empty");
				}
			}
		}
		this.spawnRow = 3; // Row where person spawns
		this.spawnCol = 15; // Col where person spawns
		this.growthRow = 3; // Row where person grows
		this.growthCol = 18; // Col where person spawns
		this.gameOver = false;
		this.gameWon = false;
		this.panicMode = false; // Is the board in panic mode
		this.panicModeClock = null; // Keep track of how long panic mode has gone on for
		this.visualsInterval = null; // Interval for managing the panic mode visuals
		this.displayVisuals = true; // By default display visuals
		this.penClock = null; // Keep track of how long a person has been waiting in pen
		this.score = 0;
		this.leaderBoard = getScoresHTML();
		this.scoreToBeat = this.leaderBoard.length == leaderBoardMaxLength ? this.leaderBoard[this.leaderBoard.length - 1] : 0;
	}


	muteVisuals() {
		// Check for interval and close it if exists
		if (this.visualsInterval != null) {
			endPanicVisualHTML(this.visualsInterval);
			this.visualsInterval = null;
		}
		this.displayVisuals = false;
	}
	unmuteVisuals() {
		// Check if in panic mode and start panic mode visuals if so
		this.displayVisuals = true;
		if (this.panicMode && this.visualsInterval == null) {
			this.visualsInterval = startPanicVisualHTML();
		}
	}

	getBoardArray() {
		return this.board;
	}

	getSpawnRow() {
		return this.spawnRow;
	}
	getSpawnCol() {
		return this.spawnCol;
	}
	getGrowthRow() {
		return this.growthRow;
	}
	getGrowthCol() {
		return this.growthCol;
	}

	addOneToScore() {
		this.score += 1;
		updateScoreHTML(this.score);
		// Check if game is won
		if (this.score >= this.scoreToWin) {
			this.markGameWon();
		}
	}

	startPanicMode() {
		// Set panic mode audio and visual if not already set
		if (!this.panicMode) {
			// Audio
			pauseThemeSong();
			playPanicSong();
			// Visual
			if (this.displayVisuals) {
				this.visualsInterval = startPanicVisualHTML();
			}
		}
		this.panicMode = true;
		this.panicModeClock = 1;
		this.penClock = null; // Panic mode resets pen time

	}
	startPenTime() {
		this.penClock = 1;
	}

	endPanicMode() {
		this.panicMode = false;
		this.panicModeClock = null;
		// End panic mode audio
		stopPanicSong();
		playThemeSong();
		// End panic mode visual
		endPanicVisualHTML(this.visualsInterval);
	}

	isPanicMode() {
		return this.panicMode;
	}
	isPersonInPen() {
		return this.board[this.growthRow][this.growthCol].hasPerson();
	}

	getPanicTime() {
		return this.panicModeClock;
	}
	getPenTime() {
		return this.penClock;
	}

	incrementPanicTime() {
		this.panicModeClock += 1;
	}
	incrementPenTime() {
		this.penClock += 1;
	}

	isGameOver() {
		return this.gameOver;
	}

	// Get the ordinal suffix of parameter
	getOrdinalSuffix(i) {
		let j = i % 10;
		let k = i % 100;
		if (j == 1 && k != 11) {
			return i + "st";
		}
		if (j == 2 && k != 12) {
			return i + "nd";
		}
		if (j == 3 && k != 13) {
			return i + "rd";
		}
		return i + "th";
	}

	// Get position of score on leaderboard
	// Should be re-written to be performant if called repeatedly or leaderboard length increases
	getPositionOnLeaderBoard() {
		for (var i = 0; i < this.leaderBoard.length; i++) {
			if (this.score > this.leaderBoard[i]) {
				return i+1;
			}
		}
		return null;
	}

	constructLeaderBoardMessage(position) {
		let message = "";
		if (position != null) {
			let positionWithSuffix = this.getOrdinalSuffix(position);
			message += positionWithSuffix + " place:";
		}
		else {
			message += "Well done:";
		}
		return message;
	}


	constructEndOfGameMessage(position) {
		let message = "";
		let messenger = null;
		let madeItToLeaderBoard = this.score > this.scoreToBeat;
		// Lost game but made it to the leader board
		if (this.gameOver && madeItToLeaderBoard) {
			// Made it top three
			if (position <= 3) {
				message += "Close!<br>You win<br>when you<br>are twice<br>sixty+6!";
				// message += "Oma,&nbsp;&nbsp;<br>&nbsp;oma,&nbsp;<br><em>&nbsp;&nbsp;Yiey!</em>";
				messenger = "yiey";
			}
			// Didn't make it to first place
			else {
				message += "<em>First<br>&nbsp;&nbsp;class!</em><br>Those<br>&nbsp;&nbsp;legs!";
				// message += "<em>Horror&nbsp;&nbsp;&nbsp;<br>&nbsp;vacui!</em><br>The leader<br>board is<br>&nbsp;busy!";
				messenger = "mummy";
			}
			
		}
		// Lost game and didn't make it to the leader board
		else if (this.gameOver && !madeItToLeaderBoard) {
			message = message + "60 years<br>wise! No win, no <br>matter!";
			// message = message + "If at<br>first you<br>don't succeed,<br>try, try again!";
			messenger = "malyon";
		}
		// Game won
		else {
			message = message + "Joindre<br>le club,<br>fledgling<br><em>Ultra<br>Runner!</em>";
			messenger = "daddy";
		}
		return {
			message: message,
			messenger: messenger
		};
	}

	markGameOver(person) {
		this.gameOver = true;
		let position = this.getPositionOnLeaderBoard();
		gameOverHTML(this.score, person.toString(), this.constructEndOfGameMessage(position));
		if (this.score > this.scoreToBeat) {
			displayLeaderBoardFormHTML(this.constructLeaderBoardMessage(position));
		}
		pauseThemeSong();
		playKnockedOutSong();
	}

	isGameWon() {
		return this.gameWon;
	}

	markGameWon() {
		this.gameWon = true;
		let position = this.getPositionOnLeaderBoard();
		gameWonHTML(this.score, this.constructEndOfGameMessage(position));
		pauseThemeSong();
		playVictorySong();
		if (this.score > this.scoreToBeat) {
			displayLeaderBoardFormHTML(this.constructLeaderBoardMessage(position));
		}
	}

	getScore() {
		return this.score;
	}

	getHeight() {
		return this.height;
	}

	getWidth() {
		return this.width;
	}

	// Move the person to the pen
	moveToPen(person) {

		person.setLastDirection(null);
		person.setPanicDirection(null);

		// First try to place in growth spot
		if (!this.board[this.growthRow][this.growthCol].hasPerson()) {
			person.changeLocationInGame(this.growthRow, this.growthCol);
		}
		else {
			// find a free location in the pen and place there
			for (var i = 17; i < 20; i++) { 
				var PEN_ROW = 5;
				if (!this.board[PEN_ROW][i].hasPerson()) {
					moveToPenHTML(person);
					person.changeLocationInGame(PEN_ROW, i);
				}
			}			
		}
		person.setInPen(true);
	}

	// Move the Person from the pen to the playing board
	freeFromPen() {
		// Only free from pen if there IS a person in growth spot 
		// and there IS NOT a person in spawn spot
		if (this.board[this.growthRow][this.growthCol].hasPerson()
			&& !this.board[this.spawnRow][this.spawnCol].hasPerson()) {

			var person = this.board[this.growthRow][this.growthCol].getAnimal();

			// Animate location change
			freeFromPenHTML(person);
			person.changeLocationInGame(this.spawnRow, this.spawnCol);
			person.setInPen(false);
			this.penClock = null;

			// If the spawn spot has a pet
			if (this.board[this.spawnRow][this.spawnCol].hasPet()) {
				// Game over
				this.markGameOver();
			}
		}

		// Now add a person to the growth spot if the space is free
		if (!this.board[this.growthRow][this.growthCol].hasPerson()) {
			// find a person in the pen and place in growth spot
			for (var i = 17; i < 20; i++) { 
				var PEN_ROW = 5;
				if (this.board[PEN_ROW][i].hasPerson()) {
					var nextPerson = this.board[PEN_ROW][i].getAnimal();
					nextPerson.changeLocationInGame(this.growthRow, this.growthCol);
					break;
				}
			}
		}
	}


	// Add square to the board and update html
	addSquareToBoard(square, x, y) {
		this.board[x][y] = square;
		updateSquareHTML(square, x, y);
	}

	// Add the animal to the square in the board and update html
	addAnimalToBoard(animal, x, y) {
		var square = this.board[x][y];
		square.addAnimal(animal);
		updateSquareHTML(animal, x, y);
	}

	// Remove the square from the board
	removeSquareFromBoard(x, y) {
		var square = new Empty("empty")
		this.board[x][y] = square;
		updateSquareHTML(square, x, y);	
	}

	// Remove the animal from the board
	removeAnimalFromBoard(animal, x, y) {
		var square = this.board[x][y];
		// If square has pet then make square empty after animal passes through
		// Check that the calling object is a pet
		if (square.hasPet() && animal instanceof Pet) {
			this.removeSquareFromBoard(x, y);
		}
		// If square has person then remove from square and leave the square as is
		// Check that the calling object is a person
		else if (square.hasPerson() && animal instanceof Person) {
			square.removeAnimal();
			updateSquareHTML(square, x, y);
		}
		
	}


}