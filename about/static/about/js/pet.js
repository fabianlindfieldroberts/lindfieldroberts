// Represents the equivelant of Pacman in the Pacman game.
// Extends the Animal class
class Pet extends Animal {

	constructor(board, x, y, filename) {
		// Initialize the location of the pet and add it to board
		super(board, x, y, filename);
		this.currentDirection = null;
		this.upcomingDirection = null;
	}

	// Takes as input a direction and sets it as the pets the upcoming direction
	addDirection(direction) {
		this.upcomingDirection = direction;
	}

	// Returns true if the square is a person and false if not
	isPerson() {
		return false;
	}

	// Move the pet one step
	move() {
		var boardArray = this.board.getBoardArray();

		// Get the upcoming direction and check if it is possible to move in that direction
		if (this.upcomingDirection != null) {
			var possibleNextX = this.getNextRow(this.upcomingDirection);
			var possibleNextY = this.getNextColumn(this.upcomingDirection);
			// If so, make the current direction that direction
			if (boardArray[possibleNextX][possibleNextY].isPath()) {
				this.currentDirection = this.upcomingDirection;
				this.upcomingDirection = null;
			}
		}

		// Having checked for possible upcoming direction, get the next square to move to
		if (this.currentDirection != null) {
			var nextX = this.getNextRow(this.currentDirection);
			var nextY = this.getNextColumn(this.currentDirection);
			var nextSquare = boardArray[nextX][nextY];	

			// Call the collide method associated with that square
			nextSquare.onCollide();

			// Move the pet to the new square if it is on the path, otherwise do nothing
			if (nextSquare.isPath()) {
				this.changeLocationInGame(nextX, nextY);
			}
		}
	}
}