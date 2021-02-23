// Represents the equivelant of a Ghost in the Pacman Game.
// Extends the Animal class
class Person extends Animal {

	constructor(board, x, y, filename) {
		// Initialize the location and filename for the person
		super(board, x, y, filename);
		this.lastDirection = null;
		this.panicDirection = null;
		this.inPen = true;
	}

	setInPen(status) {
		this.inPen = status;
	}
	getInPen() {
		return this.inPen;
	}	

	setLastDirection(direction) {
		this.lastDirection = direction;
	}
	setPanicDirection(direction) {
		this.panicDirection = direction;
	}

	// Move the pacman one step
	// Currently doesn't use a goal offset
	move(pet, offset) {
		var boardArray = this.board.getBoardArray();

		var nextDirection = null;
		if (this.board.isPanicMode()) {
			nextDirection = this.randomAtJunction();
		}
		else if (this.inPen) {
			nextDirection = this.random();
		}
		else {
			nextDirection = this.advance(pet);
		}
		// Next direction is null when the pet gets moved to pen
		if (nextDirection == null) { return; }

		// Get nextX and nextY
		var nextX = this.getNextRow(nextDirection);
		var nextY = this.getNextColumn(nextDirection);

		this.lastDirection = nextDirection;

		// Square should always be a path
		this.changeLocationInGame(nextX, nextY);		
			
	}


	// Advance the pacman towards the pet
	advance(pet) {
		// Get the Pacman board array of Square objects
		var boardArray = this.board.getBoardArray();

		// Get the goal square based off pet and offset
		var goalX = pet.getRow();
		var goalY = pet.getColumn();

		// Get the next direction using breadth first search
		var nextDirection = this.findNextDirection(goalX, goalY);

		var nextX = this.getNextRow(nextDirection);
		var nextY = this.getNextColumn(nextDirection);

		// Before moving person to the next square, check if has pet, then game over
		if (boardArray[nextX][nextY].hasPet()) {
			var pet = boardArray[nextX][nextY].getAnimal();
			pet.removeFromGame();
			this.board.markGameOver(this);
		}
		// If current square has pet, then game over and stay in current location
		else if (boardArray[this.x][this.y].hasPet()) {
			var pet = boardArray[this.x][this.y].getAnimal();
			pet.removeFromGame();
			this.board.markGameOver(this);
			return null;
		}

		// Before moving person to the next square, check if has person
		if (boardArray[nextX][nextY].hasPerson()) {
			return null;
		}

		// As soon as person takes a regular step
		// Panic direction should be set back to null
		this.panicDirection = null;

		return nextDirection;

	}

	// Make the person retreat one step away from the pet
	retreat(pet) {
		// Not yet implemented
	}

	random() {
		// Get a random direction and check direction to the right 4 times
		var boardArray = this.board.getBoardArray();
		var randomDirection = this.getRandomDirection();
		for (var i = 0; i < 4; i++) {
			var possibleDirection = this.getDirectionToRight(randomDirection);
			var possibleX = this.getNextRow(possibleDirection);
			var possibleY = this.getNextColumn(possibleDirection);
			var isPath = (
				boardArray[possibleX][possibleY].isPath()
				&& !boardArray[possibleX][possibleY].hasPerson()
			);
			if (isPath) {
				return possibleDirection;
			}
			else {
				randomDirection = possibleDirection;
			}

		}
		return "STAY";
	}

	// Keep going in the direction you are going until you hit a turning point
	// then go a random direction
	randomAtJunction() {
		// If panic mode just started, ghost should always go in opposite direction
		if (this.panicDirection == null) {
			this.panicDirection = this.getOppositeDirection(this.lastDirection);
			return this.panicDirection;
		}

		var boardArray = this.board.getBoardArray();
	
		// Search in current direction
		var possibleCurrentX = this.getNextRow(this.panicDirection);
		var possibleCurrentY = this.getNextColumn(this.panicDirection);
		var currentIsPath = (
			boardArray[possibleCurrentX][possibleCurrentY].isPath()
			&& !boardArray[possibleCurrentX][possibleCurrentY].hasPerson()
		);

		// Search to the right of current direction
		var directionToRight = this.getDirectionToRight(this.panicDirection)
		var possibleRightX = this.getNextRow(directionToRight);
		var possibleRightY = this.getNextColumn(directionToRight);
		var rightIsPath = (
			boardArray[possibleRightX][possibleRightY].isPath()
			&& !boardArray[possibleRightX][possibleRightY].hasPerson()
		);

		// Search to the left of current direction
		var directionToLeft = this.getDirectionToLeft(this.panicDirection)
		var possibleLeftX = this.getNextRow(directionToLeft);
		var possibleLeftY = this.getNextColumn(directionToLeft);
		var leftIsPath = (
			boardArray[possibleLeftX][possibleLeftY].isPath()
			&& !boardArray[possibleLeftX][possibleLeftY].hasPerson()
		);

		// If all three are paths
		if (currentIsPath && leftIsPath && rightIsPath) {
			switch(Math.floor(Math.random() * 3)) {
				case 1:
					// keep current direction
					break;
				case 2:
					this.panicDirection = directionToLeft;
					break;
				default:
					this.panicDirection = directionToRight;
			}
		}
		// Only current/right
		else if (currentIsPath && rightIsPath) {
			if (Math.random() < 0.5) {this.panicDirection = directionToRight;}
		}
		// Only left/right
		else if (leftIsPath && rightIsPath) {
			if (Math.random() < 0.5) {this.panicDirection = directionToRight;}
			else {this.panicDirection = directionToLeft;}
		}
		// Only current/left
		else if (currentIsPath && leftIsPath) {
			if (Math.random() < 0.5) {this.panicDirection = directionToLeft;}
		}
		// Only current
		else if (currentIsPath) {
			// Keep current direction
		}
		// Only left
		else if (leftIsPath) {
			this.panicDirection = directionToLeft;
		}
		// Only right
		else if (rightIsPath) {
			this.panicDirection = directionToRight;
		}
		// Otherwise go back in the direction from which came
		else {
			var oppositeDirection = this.getOppositeDirection(this.panicDirection);
			this.panicDirection = oppositeDirection;
		}

		var nextX = this.getNextRow(this.panicDirection);
		var nextY = this.getNextColumn(this.panicDirection);

		// Before moving person to the next square, check if has pet, then person goes to pen
		// Also if current square has pet, then person goes to pen
		if (boardArray[nextX][nextY].hasPet() || boardArray[this.x][this.y].hasPet()) {
			this.board.moveToPen(this);
			return null;
		}

		return this.panicDirection;
	}


	// Function for finding the shortest path between the person and the pacman
	// using breadth first search, returns the first direction in the shortest
	// path
	findNextDirection(goalX, goalY) {
		// If the current location is the goal then return direction "STAY"
		if (goalX == this.x && goalY == this.y) {
			return "STAY";
		}

		// create a boolean grid to store which locations have been visited
		var width = this.board.getWidth();
		var height = this.board.getHeight();
		var visitedLocations = new Array(width);
		for (var i = 0; i < width; i++) { 
			visitedLocations[i] = new Array(height); 
			// For each item in the row, add a square object
			for (var j = 0; j < height; j++) {
				visitedLocations[i][j] = false;
			}
		}

		// Each "location" will store its coordinates
		// and the shortest path required to arrive there
		var location = {
			row: this.x, // current x coordinate of person
			column: this.y, // current y coordinate of person
			path: [], // shortest path to location
			pathHasPerson: false, // boolean true if the path to this location has a person
			status: "start"//<<<<<IF THIS IS THE PERSON THEN NEED TO SET TO 'GOAL'
		};

		// Initialize the queue with the start location already inside
		var queue = [location];
		// alternate next step if there is no path without person
		var alternateLocation = null;

		// Loop through the grid searching for the goal
		while (queue.length > 0) {
			// Take the first location off the queue
			var currentLocation = queue.shift();
			
			// Explore West
			var newLocation = this.exploreInDirection(currentLocation, visitedLocations, 'LEFT', goalX, goalY);
			if (newLocation.status === 'goal') {
				// If path to pet has a person in it set as alternateLocation
				if (newLocation.pathHasPerson) {
					// We only want to add the shortest alternate paths
					if (alternateLocation == null) {
						alternateLocation = newLocation.path[0];
					}
				}
				else {
					return newLocation.path[0]; 
				}
			} 
			else if (newLocation.status === 'valid' || newLocation.status === 'person') { 
				queue.push(newLocation); 
			}

			// Explore North
			var newLocation = this.exploreInDirection(currentLocation, visitedLocations, 'UP', goalX, goalY);
			if (newLocation.status === 'goal') {
				if (newLocation.pathHasPerson) {
					if (alternateLocation == null) {
						alternateLocation = newLocation.path[0];
					}
				}
				else {
					return newLocation.path[0]; 
				} 
			} 
			else if (newLocation.status === 'valid' || newLocation.status === 'person') { 
				queue.push(newLocation); 
			}

			// Explore East
			var newLocation = this.exploreInDirection(currentLocation, visitedLocations, 'RIGHT', goalX, goalY);
			if (newLocation.status === 'goal') { 
				if (newLocation.pathHasPerson) {
					if (alternateLocation == null) {
						alternateLocation = newLocation.path[0];
					}
				}
				else {
					return newLocation.path[0]; 
				}
			} 
			else if (newLocation.status === 'valid' || newLocation.status === 'person') { 
				queue.push(newLocation); 
			}

			// Explore South
			var newLocation = this.exploreInDirection(currentLocation, visitedLocations, 'DOWN', goalX, goalY);
			if (newLocation.status === 'goal') { 
				if (newLocation.pathHasPerson) {
					if (alternateLocation == null) {
						alternateLocation = newLocation.path[0];
					}
				}
				else {
					return newLocation.path[0]; 
				}
			} 
			else if (newLocation.status === 'valid' || newLocation.status === 'person') { 
				queue.push(newLocation); 
			}
		}
		// No path found without a person, return shortest path with a person
		return alternateLocation;
	};


	// This function will check a location's status
	// (a location is "valid" if it is on the grid, is not an "obstacle",
	// and has not yet been visited by our algorithm)
	// Returns "Valid", "Invalid", "Blocked", or "Goal"
	getNewLocationStatus(newLocation, visitedLocations, goalX, goalY) {
		var width = this.board.getWidth();
		var height = this.board.getHeight();
		var boardArray = this.board.getBoardArray();
		var row = newLocation.row;
		var column = newLocation.column;

		// If the location is not on the grid
		if (row < 0 || row >= height || column < 0 || column >= width) {
			return 'invalid';
		}
		// If the location is the goal
		else if (row == goalX && column == goalY) {
			return 'goal';
		} 
		// If location is a wall or has been visited
		else if (!boardArray[row][column].isPath() || visitedLocations[row][column]) {
			return 'blocked';
		}
		// If location has a person on it
		else if (boardArray[row][column].hasPerson()) {
			return 'person';
		}
		else {
			return 'valid';
		}
	};

	// Explores the grid from the given location in the given
	// direction
	exploreInDirection(currentLocation, visitedLocations, direction, goalX, goalY) {
		var newPath = currentLocation.path.slice();
		newPath.push(direction);

		var row = currentLocation.row;
		var column = currentLocation.column;

		if (direction === 'LEFT') { column -= 1; } 
		else if (direction === 'UP') { row -= 1; } 
		else if (direction === 'RIGHT') { column += 1; } 
		else if (direction === 'DOWN') { row += 1; }

		var newLocation = {
			row: row,
			column: column,
			path: newPath, 
			pathHasPerson: currentLocation.pathHasPerson,
			status: 'unknown'
		};
		newLocation.status = this.getNewLocationStatus(newLocation, visitedLocations, goalX, goalY);

		// If this new location is valid or a person, mark it as 'Visited'
		if (newLocation.status === 'valid' || newLocation.status === 'person') {
			visitedLocations[row][column] = true;
			// If new location is a person update pathHasPerson status
			if (newLocation.status === 'person') {
				newLocation.pathHasPerson = true;
			}
		}
		return newLocation;
	};
}








