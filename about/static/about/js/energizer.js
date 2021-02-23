class Energizer extends Square { 

	// Determines what happens when a pet collides with this object
	onCollide() {
		this.board.startPanicMode();
	}

	// Returns true if passage is allowed and false if not
	isPath() {
		return true;
	}
}