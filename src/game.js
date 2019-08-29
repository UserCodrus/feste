var character;
var animated;

var Game = {
	canvas: 0,
	frame_counter: 1,
	start: function (page_canvas, frame_time) {
		// Get the graphics context
		this.canvas = page_canvas;
		this.context = this.canvas.getContext("2d");

		// Trigger canvas updates
		this.interval = setInterval(this.update, frame_time);

		/// Testing stuff ///
		character = new Sprite(100, 100, 16, 16, 16, 16, 1, "img/guy.png");
		animated = new Sprite(50, 50, 16, 16, 128, 64, 1, "img/testanim.png");
	},
	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop: function () {
		clearInterval(this.interval);
	},
	update: function () {
		Game.clear();
		character.update();
		animated.update();

		Game.frame_counter++;
		var status = document.getElementById("status");
		status.innerHTML = Game.frame_counter;
	}
};

function Sprite(x, y, sprite_width, sprite_height, sheet_width, sheet_height, speed, file) {
	// Set the image
	this.image = new Image();
	this.image.src = file;

	// Set the size and location
	this.x = x;
	this.y = y;
	this.width = sprite_width;
	this.height = sprite_height;

	this.sheet_width = sheet_width;
	this.sheet_height = sheet_height;

	this.subimage = 0;
	this.skip = 0;
	this.speed = speed;

	// Set the update callback
	this.update = function () {
		// Draw a sprite
		Game.context.drawImage(this.image, this.subimage * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);

		// Increment the animation
		this.skip++;
		if (this.skip >= speed) {
			this.skip = 0;

			this.subimage++;
			if (this.subimage * this.width >= this.sheet_width) {
				this.subimage = 0;
			}
		}
	}
};

function beginGame() {
	// Adjust the resolution of the canvas
	var canvas = document.getElementById("canvas");
	canvas.width = 320;
	canvas.height = 240;

	// Start the game
	Game.start(canvas, 33);
};