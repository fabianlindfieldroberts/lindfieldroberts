// Javascript audio helper functions
function playThemeSong() {
	var player = document.getElementById("theme_player");
	player.play();
}

function pauseThemeSong() {
	var player = document.getElementById("theme_player");
	player.pause();	
}

function playPanicSong() {
	var player = document.getElementById("panic_player");
	player.play();
}

function stopPanicSong() {
	var player = document.getElementById("panic_player");
	player.pause();
	player.currentTime = 0;
}

function playVictorySong() {
	var player = document.getElementById("victory_player");
	player.play();
}

function playKnockedOutSong() {
	var player = document.getElementById("ko_player");
	player.play();
}

// Functions for muting and unmuting all video and audio elements on the page
function mutePage() {
	document.querySelectorAll("video, audio").forEach( element => element.muted = true );
}
function unmutePage() {
	document.querySelectorAll("video, audio").forEach( element => element.muted = false );
}