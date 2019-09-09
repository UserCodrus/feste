"use strict";

var Graphics = {
	// The web page's canvas
	canvas: null,
	// The drawing context
	context: null,

	// The url of the image data - loaded from graphics.json
	location: "",
	// The game's sprites - loaded from graphics.json
	sprites: null,

	// Set to true to draw bounding boxes
	show_collision: true,

	// The framerate counter - enable or disable with Graphics.showFPS([true / false])
	framerate_counter: null,
	frames: 0,
	fps: 0,

	// Get a sprite with a given id from the sprite data array
	getSprite: function (id) {
		if (this.sprites) {
			let obj;
			for (obj of this.sprites) {
				if (obj.id == id) {
					return obj;
				}
			}
		} else {
			return null;
		}
	},

	// Draw a frame
	render: function () {
		// Clear the canvas
		Graphics.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Draw backgrounds
		let bg;
		for (bg of Game.background) {
			Graphics.draw(bg, 0, 0);
		}

		// Draw objects
		Graphics.context.strokeStyle = "#FFFFFF";
		Graphics.context.lineWidth = 1;
		let obj;
		for (obj of Game.static) {
			// Draw static sprites
			if (obj.sprite) {
				Graphics.draw(obj.sprite, obj.x, obj.y);
			}

			// Draw bounding boxes if enabled
			if (Graphics.show_collision) {
				Graphics.context.globalAlpha = 0.5;
				Graphics.context.strokeRect(obj.collision.x, obj.collision.y, obj.collision.width, obj.collision.height);
				Graphics.context.globalAlpha = 1;
			}
		}
		for (obj of Game.entity) {
			// Draw entity sprites
			Graphics.draw(obj.sprite, obj.x, obj.y);

			// Draw bounding boxes if enabled
			if (Graphics.show_collision) {
				Graphics.context.globalAlpha = 0.5;
				Graphics.context.strokeRect(obj.collision.x, obj.collision.y, obj.collision.width, obj.collision.height);
				Graphics.context.globalAlpha = 1;
			}
		}

		// Draw the fps counter
		if (Graphics.framerate_counter) {
			Graphics.context.font = "10px Consolas";
			Graphics.context.fillText("FPS  " + Graphics.fps, 2, 10);

			// Increment the fps counter
			Graphics.frames++;
		}
	},

	// Draw a sprite
	draw: function (sprite, x, y, animation) {
		if (animation) {
			Graphics.context.drawImage(sprite.image, animation.x, animation.y, sprite.width, sprite.height, Math.round(x), Math.round(y), sprite.width, sprite.height);
		} else {
			Graphics.context.drawImage(sprite.image, Math.round(x), Math.round(y), sprite.width, sprite.height);
		}
	},

	// Measure framerate
	frameCounter: function () {
		Graphics.fps = Graphics.frames;
		Graphics.frames = 0;
	},

	// Start or stop the fps counter
	showFPS: function (state) {
		if (state) {
			// Start the fps counter if it isn't already running
			if (!Graphics.framerate_counter) {
				Graphics.framerate_counter = setInterval(Graphics.frameCounter, 1000);
				Graphics.fps = 0;
				Graphics.frames = 0;
			}
		} else {
			if (Graphics.framerate_counter) {
				clearInterval(Graphics.framerate_counter);
				Graphics.framerate_counter = null;
			}
		}
	}
};

// A sprite entry in the graphics.json data file
function Sprite(id, filename, width, height) {
	this.id = id;
	this.file = filename;
	this.type = "sprite";
	this.width = width;
	this.height = height;
}

// A background entry in the graphics.json data file
function Background(id, filename, width, height, parallax) {
	this.id = id;
	this.file = filename;
	this.type = "background";
	this.width = width;
	this.height = height;
	this.parallax = parallax;
}