"use strict";

var character;

var Game = {
	background: [],
	static: [],
	entity: [],

	// Start the game
	start: function (page_canvas, frame_time) {
		// Get the graphics context
		Graphics.canvas = page_canvas;
		Graphics.context = Graphics.canvas.getContext("2d");

		// Catch key presses
		window.addEventListener("keydown", Input.keyPress);
		window.addEventListener("keyup", Input.keyRelease);

		// Measure framerate
		Graphics.showFPS(true);;

		/// Testing stuff ///
		// Test backgrounds
		this.background.push(Graphics.getSprite("back"));

		// Test static collision
		let animate = new Static(50, 50, "guy", new BoundingBox(16, 16));
		this.static.push(animate);
		this.static.push(new Static(0, 240, null, new BoundingBox(320, 10)));
		this.static.push(new Static(0, -10, null, new BoundingBox(320, 10)));
		this.static.push(new Static(320, 0, null, new BoundingBox(10, 240)));
		this.static.push(new Static(-10, 0, null, new BoundingBox(10, 240)));

		// Test character callbacks
		animate = new Entity(150, 50, "box", new BoundingBox(16, 16));
		animate.setAnimation("bloop");
		this.entity.push(animate);
		character = new TestObject(100, 100, "guy", new BoundingBox(16, 16));
		this.entity.push(character);
		/// End Tests ///

		// Start the game loop
		window.requestAnimationFrame(Game.loop);
	},

	// The game loop
	loop: function (timestamp) {
		// Measure the time change since the last frame
		let delta = (timestamp - Game.timer) / 1000;
		Game.timer = timestamp;

		// Update entities
		let obj;
		for (obj of Game.entity) {
			obj.update(delta);
		}

		// Draw a frame
		Graphics.render();

		// Wait for the next draw cycle
		window.requestAnimationFrame(Game.loop);
	}
};

function beginGame() {
	// Adjust the resolution of the canvas
	let canvas = document.getElementById("canvas");
	canvas.width = 320;
	canvas.height = 240;

	// Load graphics data
	$.getJSON("data/graphics.json", function (json) {
		Graphics.sprites = json.sprites;
		Graphics.location = json.location;

		// Load sprite data
		let obj;
		for (obj of Graphics.sprites) {
			obj.image = new Image();
			obj.image.src = Graphics.location + obj.file;
		}

		console.log("Sprite list loaded");
		console.log(Graphics);

		// Start the game
		Game.start(canvas, 5);;
	});
};

