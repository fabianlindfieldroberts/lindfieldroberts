// This class acts as a kind of interface implemented by all animal classes
class Animal {

	constructor(board, x, y, filename) {
		// Each animal is associated with a board
		this.board = board;
		// Each animal is also associated with a location on the board
		this.x = x;
		this.y = y;
		// Each animal has a filename for a file with the image of the animal
		// This filename is also the CSS class name
		this.filename = filename;

		// Add the animal to the game
		this.addToGame()
	}

	// Get the horizontal location of the animal
	getRow() {
		return this.x;
	}

	// Get the vertical location of the animal
	getColumn() {
		return this.y;
	}

	// Get the x coordinate of the next square
	getNextRow(direction) {
		if (direction == "LEFT") { 
			return this.x; 
		}
		else if (direction == "UP") { 
			return this.x - 1;
		}
		else if (direction == "RIGHT") { 
			return  this.x; 
		}
		else if (direction == "DOWN") { 
			return this.x + 1; 
		}
		else if (direction == "STAY") {
			return this.x;
		}
	}

	// Get the y coordinate of the next square
	getNextColumn(direction) {
		if (direction == "LEFT") { 
			return this.y - 1; 
		}
		else if (direction == "UP") { 
			return this.y;
		}
		else if (direction == "RIGHT") { 
			return  this.y + 1; 
		}
		else if (direction == "DOWN") { 
			return this.y; 
		}
		else if (direction == "STAY") {
			return this.y;
		}
	}

	// Get the direction to the left of the current direction
	getDirectionToLeft(direction) {
		if (direction == "LEFT") { 
			return "DOWN"; 
		}
		else if (direction == "UP") { 
			return "LEFT";
		}
		else if (direction == "RIGHT") { 
			return  "UP"; 
		}
		else if (direction == "DOWN") { 
			return "RIGHT"; 
		}
	}

	// Get the direction to the right of the current direction
	getDirectionToRight(direction) {
		if (direction == "LEFT") { 
			return "UP"; 
		}
		else if (direction == "UP") { 
			return "RIGHT";
		}
		else if (direction == "RIGHT") { 
			return  "DOWN"; 
		}
		else if (direction == "DOWN") { 
			return "LEFT"; 
		}
	}

	// Get the direction opposite the current direction
	getOppositeDirection(direction) {
		if (direction == "LEFT") { 
			return "RIGHT"; 
		}
		else if (direction == "UP") { 
			return "DOWN";
		}
		else if (direction == "RIGHT") { 
			return  "LEFT"; 
		}
		else if (direction == "DOWN") { 
			return "UP"; 
		}
	}

	// Get a random direction
	getRandomDirection() {
		switch(Math.floor(Math.random() * 4)) {
			case 1:
				return "LEFT";
			case 2:
				return "UP";
			case 3: 
				return "RIGHT";
			default:
				return "DOWN";
		}
	}

	// Remove the animal from the board at the current location
	removeFromGame() {
		this.board.removeAnimalFromBoard(this, this.x, this.y);
	}

	// Add the animal to the board at the current location
	addToGame() {
		this.board.addAnimalToBoard(this, this.x, this.y);
	}

	// Add the animal to the board at the location (x, y)
	addToGameAtLocation(x, y) {
		this.board.addAnimalToBoard(this, x, y);
		this.x = x;
		this.y = y;
	}

	// Change the location of the animal in the game
	changeLocationInGame(x, y) {
		this.removeFromGame();
		this.addToGameAtLocation(x, y);
		this.x = x;
		this.y = y;
	}

	// Returns the string name of object
	toString() {
		return this.filename;
	}

}