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
	draw_collision: true,

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
		// Test backgrounds
		this.background.push(new Sprite("img/back.png", 320, 240));

		// Test static collision
		let animate = new Static(50, 50, new SpriteSheet("img/testanim.png", 16, 16, 128, 16), new BoundingBox(16, 16));
		this.static.push(animate);
		this.static.push(new Static(0, 240, 0, new BoundingBox(320, 10)));
		this.static.push(new Static(0, -10, 0, new BoundingBox(320, 10)));
		this.static.push(new Static(320, 0, 0, new BoundingBox(10, 240)));
		this.static.push(new Static(-10, 0, 0, new BoundingBox(10, 240)));

		// Test character callbacks
		character = new Entity(100, 100, new Sprite("img/guy.png", 16, 16), new BoundingBox(16, 16));
		character.onFrameUpdate = movement;
		character.onCollision = function (object) {
			Game.log("bonk at " + object.x + ", " + object.y);
		};
		this.entity.push(character);
		/// End Tests ///

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
		// Update entities
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
			bg.draw(0, 0);
		}

		// Draw statics and entities
		this.context.strokeStyle = "#FFFFFF";
		this.context.lineWidth = 1;
		let obj;
		for (obj of Game.static) {
			// Draw sprites
			if (obj.sprite) {
				obj.sprite.draw(obj.x, obj.y, 0);
			}

			// Draw bounding boxes if enabled
			if (this.draw_collision) {
				this.context.globalAlpha = 0.5;
				this.context.strokeRect(obj.collision.x, obj.collision.y, obj.collision.width, obj.collision.height);
				this.context.globalAlpha = 1;
			}
		}
		for (obj of Game.entity) {
			// Draw sprites
			obj.sprite.draw(obj.x, obj.y);

			// Draw bounding boxes if enabled
			if (this.draw_collision) {
				this.context.globalAlpha = 0.5;
				this.context.strokeRect(obj.collision.x, obj.collision.y, obj.collision.width, obj.collision.height);
				this.context.globalAlpha = 1;
			}
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

function movement(delta) {
	// Set speed
	let speed = 32 * delta;
	if (Game.keys[Keyboard.key_shift]) {
		speed *= 2;
	}

	// Horizontal movement
	if (Game.keys[Keyboard.key_a]) {
		this.x_velocity = -speed;
	}
	else if (Game.keys[Keyboard.key_d]) {
		this.x_velocity = speed;
	}
	else {
		this.x_velocity = 0;
	}
	// Vertical movement
	if (Game.keys[Keyboard.key_w]) {
		this.y_velocity = -speed;
	}
	else if (Game.keys[Keyboard.key_s]) {
		this.y_velocity = speed;
	}
	else {
		this.y_velocity = 0;
	}
}