"use strict";

var character;
var animated;

var hit;
var char_box;
var anim_box;

var background;

var Game = {
	canvas: 0,
	keys: [],
	log_output: "Initializing...",

	frames: 0,
	fps: 0,
	seconds: 0,

	timer: 0,

	collision: [],

	// Start the game
	start: function (page_canvas, frame_time) {
		// Get the graphics context
		this.canvas = page_canvas;
		this.context = this.canvas.getContext("2d");

		// Catch key presses
		window.addEventListener("keydown", this.keyPress);
		window.addEventListener("keyup", this.keyRelease);

		// Measure framerate
		this.interval = setInterval(this.framerate, 1000);
		this.log_status = document.getElementById("status");

		/// Testing stuff ///
		character = new Sprite(100, 100, 16, 16, 16, 16, 1, "img/guy.png");
		animated = new Sprite(50, 50, 16, 16, 128, 64, 1, "img/testanim.png");
		background = new Sprite(0, 0, 320, 240, 320, 240, 1, "img/back.png");
		char_box = new BoundingBox(character.x + 4, character.y, character.width - 5, character.height);

		this.collision.push(char_box);
		this.collision.push(new BoundingBox(animated.x, animated.y, animated.width, animated.height));
		this.collision.push(new BoundingBox(0, 240, 320, 340));
		this.collision.push(new BoundingBox(0, -100, 320, 100));
		this.collision.push(new BoundingBox(-100, 0, 100, 240));
		this.collision.push(new BoundingBox(320, 0, 420, 240));
		hit = false;

		// Start the game loop
		window.requestAnimationFrame(Game.loop);
	},
	stop: function () {
		clearInterval(this.interval);
	},
	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},

	// The game loop
	loop: function (timestamp) {
		// Measure the time change since the last frame
		let delta = (timestamp - Game.timer) / 1000;
		Game.timer = timestamp;

		// Update and draw
		Game.update(delta);
		Game.draw();

		// Wait for the next draw cycle
		window.requestAnimationFrame(Game.loop);
	},

	// Update the game
	update: function (delta) {
		let speed = 32 * delta;

		let x_velocity = 0;
		let y_velocity = 0;

		// Check input
		if (Game.keys[65]) {
			x_velocity = -speed;
		}
		if (Game.keys[68]) {
			x_velocity = speed;
		}
		if (Game.keys[87]) {
			y_velocity = -speed;
		}
		if (Game.keys[83]) {
			y_velocity = speed;
		}

		char_box.x = character.x + 3;
		char_box.y = character.y;

		// Detect collisions
		let box = 0;
		let x_collide = false;
		let y_collide = false;
		// X Axis
		for (box of Game.collision) {
			if (box != char_box) {
				if (char_box.boxCollision(box, x_velocity, 0)) {
					x_collide = true;
				}
			}
		}
		// Y Axis
		for (box of Game.collision) {
			if (box != char_box) {
				if (char_box.boxCollision(box, 0, y_velocity)) {
					y_collide = true;
				}
			}
		}
		// Move the character
		if (!x_collide) {
			character.x += x_velocity;
		}
		if (!y_collide) {
			character.y += y_velocity;
		}
	},

	// Draw to the canvas
	draw: function () {
		// Clear the canvas
		Game.clear();

		// Draw stuff
		background.draw();
		character.draw();
		animated.animate();

		// Draw log text
		Game.drawLog();

		// Increment the frame counter
		Game.frames++;
	},

	// Add text to the game log
	log: function (text) {
		Game.log_output += text;
	},

	// Draw the log
	drawLog: function () {
		Game.context.font = "10px Consolas";
		Game.context.fillText("FPS  " + Game.fps, 2, 10);
		Game.context.fillText("TIME " + Game.seconds, 2, 20);
		Game.context.fillText(Game.log_output, 2, 30);
	},

	// Measure framerate
	framerate: function () {
		Game.seconds++;
		Game.fps = Game.frames;
		Game.log_output = "";
		Game.frames = 0;
	},

	// Key handlers
	keyPress: function (e) {
		Game.keys[e.keyCode] = true;
	},
	keyRelease: function (e) {
		Game.keys[e.keyCode] = false;
	},
};

function beginGame() {
	// Adjust the resolution of the canvas
	let canvas = document.getElementById("canvas");
	canvas.width = 320;
	canvas.height = 240;

	// Start the game
	Game.start(canvas, 5);
};