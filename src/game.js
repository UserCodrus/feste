"use strict";

var character;

var Game = {
	background: [],
	static: [],
	entity: [],

	// Start the game
	initialize: function () {
		// Get the graphics context and adjust the canvas
		Graphics.canvas = document.getElementById("canvas");
		Graphics.canvas.width = 320;
		Graphics.canvas.height = 240;
		Graphics.context = Graphics.canvas.getContext("2d");

		// Catch key presses
		window.addEventListener("keydown", Input.keyPress);
		window.addEventListener("keyup", Input.keyRelease);

		// Measure framerate
		Graphics.showFPS(true);

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

		if (delta) {
			// Update entities
			let obj;
			for (obj of Game.entity) {
				obj.update(delta);
			}

			// Draw a frame
			Graphics.render();
		}

		// Wait for the next draw cycle
		window.requestAnimationFrame(Game.loop);
	},

	// Start the game
	fBegin: function () {
		// Load graphics data
		getJSON("data/graphics.json", Graphics.load);
	}
};

var getJSON = function (address, callback) {
	var xhttp = new XMLHttpRequest();

	// Prepare the callback to trigger when the request is complete
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let json = JSON.parse(this.responseText);
			callback(json);
		}
	};

	// Send the http request
	xhttp.open("GET", address, true);
	xhttp.send();
}