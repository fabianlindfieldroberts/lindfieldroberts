// This class acts as a kind of interface implemented by all square classes
class Square {
	constructor(board, filename, animal) {
		// Each square is associated with a board
		this.board = board;
		// Each square has a filename for a file with the image of the square
		// This filename is also the CSS class name
		this.filename = filename;
		// Each square might have an animal 
		this.animal = animal;
	}

	// Returns the string name of object
	toString() {
		return this.filename;
	}

	// Returns true if the square has an animal and false if not
	hasAnimal() {
		// null or undefined
		if (this.animal==null) {
			return false;
		}
		else {
			return true;
		}
	}

	// Returns the animal in the square
	getAnimal() {
		return this.animal;
	}

	// Return true if the animal is a pet, false otherwise
	hasPet() {
		if (this.hasAnimal()) {
			return this.animal instanceof Pet;
		}
		else {
			return false;
		}
	}

	// Return true if the animal is a person, false otherwise
	hasPerson() {
		if (this.hasAnimal()) {
			return this.animal instanceof Person;
		}
		else {
			return false;
		}
	}

	// Adds an animal to the square
	addAnimal(animal) {
		this.animal = animal;
	}

	// Removes the animal from the square
	removeAnimal() {
		this.animal = null;
	}

}