"use strict";

var character;
var animated;

var Game = {
	canvas: 0,
	keys: [],
	frames: 0,
	seconds: 0,
	start: function (page_canvas, frame_time) {
		// Get the graphics context
		this.canvas = page_canvas;
		this.context = this.canvas.getContext("2d");

		// Catch key presses
		window.addEventListener("keydown", this.keyPress);
		window.addEventListener("keyup", this.keyRelease);

		// Trigger canvas updates
		this.interval = setInterval(this.update, frame_time);
		this.intervalb = setInterval(this.framerate, 1000);

		this.log_status = document.getElementById("status");

		/// Testing stuff ///
		character = new Sprite(100, 100, 16, 16, 16, 16, 1, "img/guy.png");
		animated = new Sprite(50, 50, 16, 16, 128, 64, 1, "img/testanim.png");
	},
	stop: function () {
		clearInterval(this.interval);
	},
	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	update: function () {
		// Clear the canvas
		Game.clear();

		if (Game.keys[65]) {
			character.x -= 1.5;
		}
		if (Game.keys[68]) {
			character.x += 1.5;
		}
		if (Game.keys[87]) {
			character.y -= 1.5;
		}
		if (Game.keys[83]) {
			character.y += 1.5;
		}

		// Draw stuff
		character.draw();
		animated.animate();

		Game.frames++;
	},
	keyPress: function (e) {
		Game.keys[e.keyCode] = true;
	},
	keyRelease: function (e) {
		Game.keys[e.keyCode] = false;
	},

	framerate: function () {
		Game.seconds++;
		Game.log_status.innerHTML = "TIME " + Game.seconds + "<br>FPS " + Game.frames;
		Game.frames = 0;
	}
};

function beginGame() {
	// Adjust the resolution of the canvas
	var canvas = document.getElementById("canvas");
	canvas.width = 320;
	canvas.height = 240;

	// Start the game
	Game.start(canvas, 5);
};