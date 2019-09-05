"use strict";

var character;

var Game = {
	canvas: 0,
	keys: [],
	log_output: "Initializing...",

	frames: 0,
	fps: 0,
	seconds: 0,

	timer: 0,

	background: [],
	static: [],
	entity: [],

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
		this.background.push(new Sprite(0, 0, 320, 240, 320, 240, 1, "img/back.png"));

		let animate = new Static(50, 50, new Sprite(0, 0, 16, 16, 128, 64, 1, "img/testanim.png"), new BoundingBox(0, 0, 16, 16));
		animate.sprite.animated = true;
		this.static.push(animate);
		this.static.push(new Static (0, 240, 0, new BoundingBox(0, 0, 320, 10)));
		this.static.push(new Static(0, -10, 0, new BoundingBox(0, 0, 320, 10)));
		this.static.push(new Static(320, 0, 0, new BoundingBox(0, 0, 10, 240)));
		this.static.push(new Static(-10, 0, 0, new BoundingBox(0, 0, 10, 240)));

		character = new Entity(100, 100, new Sprite(0, 0, 16, 16, 16, 16, 1, "img/guy.png"), new BoundingBox(0, 0, 16, 16));
		this.entity.push(character);

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

		// Check input
		if (Game.keys[65]) {
			character.x_velocity = -speed;
		}
		else if (Game.keys[68]) {
			character.x_velocity = speed;
		}
		else {
			character.x_velocity = 0;
		}
		if (Game.keys[87]) {
			character.y_velocity = -speed;
		}
		else if (Game.keys[83]) {
			character.y_velocity = speed;
		}
		else {
			character.y_velocity = 0;
		}

		// Update all entities
		let obj;
		for (obj of Game.entity) {
			obj.update(delta);
		}
	},

	// Draw to the canvas
	draw: function () {
		// Clear the canvas
		Game.clear();

		// Draw stuff
		let bg;
		for (bg of Game.background) {
			bg.draw();
		}

		// Draw statics and entities
		let obj;
		for (obj of Game.static) {
			if (obj.sprite) {
				if (obj.sprite.animated) {
					obj.sprite.animate();
				}
				else {
					obj.sprite.draw();
				}
			}
		}
		for (obj of Game.entity) {
			obj.sprite.draw();
		}

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
		Game.context.fillText("COORD " + Math.round(character.x) + ", " + Math.round(character.y), 2, 30);
		Game.context.fillText(Game.log_output, 2, 40);
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