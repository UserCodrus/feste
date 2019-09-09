"use strict";

var character;

var Game = {
	canvas: 0,
	keys: [],

	timer: 0,
	show_collision: true,
	show_debug: true,

	frames: 0,
	fps: 0,
	seconds: 0,

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
			if (this.show_collision) {
				this.context.globalAlpha = 0.5;
				this.context.strokeRect(obj.collision.x, obj.collision.y, obj.collision.width, obj.collision.height);
				this.context.globalAlpha = 1;
			}
		}
		for (obj of Game.entity) {
			// Draw sprites
			obj.sprite.draw(obj.x, obj.y);

			// Draw bounding boxes if enabled
			if (this.show_collision) {
				this.context.globalAlpha = 0.5;
				this.context.strokeRect(obj.collision.x, obj.collision.y, obj.collision.width, obj.collision.height);
				this.context.globalAlpha = 1;
			}
		}

		// Draw debug text
		if (this.show_debug) {
			Game.context.font = "10px Consolas";
			Game.context.fillText("FPS  " + Game.fps, 2, 10);
			Game.context.fillText("TIME " + Game.seconds, 2, 20);
			Game.context.fillText("COORD " + Math.round(character.x) + ", " + Math.round(character.y), 2, 30);
		}

		// Increment the frame counter
		Game.frames++;
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

	// Load graphics data
	loadSprites();

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

// Keyboard keycodes
const Keyboard = {
	key_backspace: 8,
	key_tab: 9,
	key_enter: 13,
	key_shift: 16,
	key_ctrl: 17,
	key_alt: 18,
	key_esc: 27,
	key_page_up: 33,
	key_page_down: 34,
	key_end: 35,
	key_home: 36,
	key_left: 37,
	key_up: 38,
	key_right: 39,
	key_down: 40,
	key_insert: 45,
	key_delete: 46,
	key_0: 48,
	key_1: 49,
	key_2: 50,
	key_3: 51,
	key_4: 52,
	key_5: 53,
	key_6: 54,
	key_7: 55,
	key_8: 56,
	key_9: 57,
	key_a: 65,
	key_b: 66,
	key_c: 67,
	key_d: 68,
	key_e: 69,
	key_f: 70,
	key_g: 71,
	key_h: 72,
	key_i: 73,
	key_j: 74,
	key_k: 75,
	key_l: 76,
	key_m: 77,
	key_n: 78,
	key_o: 79,
	key_p: 80,
	key_q: 81,
	key_r: 82,
	key_s: 83,
	key_t: 84,
	key_u: 85,
	key_v: 86,
	key_w: 87,
	key_x: 88,
	key_y: 89,
	key_z: 90,
	key_num_0: 96,
	key_num_1: 97,
	key_num_2: 98,
	key_num_3: 99,
	key_num_4: 100,
	key_num_5: 101,
	key_num_6: 102,
	key_num_7: 103,
	key_num_8: 104,
	key_num_9: 105,
	key_num_multiply: 106,
	key_num_add: 107,
	key_num_subtract: 109,
	key_num_decimal: 110,
	key_num_divide: 111,
	key_f1: 112,
	key_f2: 113,
	key_f3: 114,
	key_f4: 115,
	key_f5: 116,
	key_f6: 117,
	key_f7: 118,
	key_f8: 119,
	key_f9: 120,
	key_f10: 121,
	key_f11: 122,
	key_f12: 123,
	key_semicolon: 186,
	key_equals: 187,
	key_comma: 188,
	key_dash: 189,
	key_period: 190,
	key_forward_slash: 191,
	key_tilde: 192,
	key_left_bracket: 219,
	key_back_slash: 220,
	key_right_bracket: 221,
	key_apostrophe: 222
};