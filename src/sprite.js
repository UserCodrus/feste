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

	// The framerate of sprites
	sprite_fps: 6,

	// Set to true when the sprite list is loaded
	ready: false,

	// Load sprite resources from a json file
	load: function (json) {
		Graphics.sprites = json.sprites;
		Graphics.location = json.location;

		// Load sprite data
		let obj;
		for (obj of Graphics.sprites) {
			obj.image = new Image();
			obj.image.src = Graphics.location + obj.file;
		}

		console.log("Graphics data loaded");

		Graphics.ready = true;
	},

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
			Graphics.draw(bg, null, 0, 0);
		}

		// Draw objects
		Graphics.context.strokeStyle = "#FFFFFF";
		Graphics.context.lineWidth = 1;
		let obj;
		for (obj of Game.objects) {
			// Draw entity sprites
			if (obj.sprite) {
				Graphics.draw(obj.sprite, obj.animation, obj.x, obj.y);
			}

			// Draw bounding boxes if enabled
			if (Graphics.show_collision && obj.hitbox) {
				Graphics.context.globalAlpha = 0.5;
				Graphics.context.strokeRect(Math.round(obj.hitbox.x), Math.round(obj.hitbox.y), obj.hitbox.width, obj.hitbox.height);
				Graphics.context.globalAlpha = 1;
			}
		}

		// Draw the fps counter
		if (Graphics.framerate_counter) {
			Graphics.context.textAlign = "left";
			Graphics.context.font = "10px Consolas";
			Graphics.context.fillText("FPS  " + Graphics.fps, 2, 10);

			// Increment the fps counter
			Graphics.frames++;
		}
	},

	// Draw a splash screen with text
	splash: function (message) {
		// Clear the canvas
		Graphics.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Draw loading text
		Graphics.context.textAlign = "center";
		Graphics.context.font = "10px Consolas";
		Graphics.context.fillText(message, Graphics.canvas.width / 2, Graphics.canvas.height / 2);
	},

	// Draw a sprite
	draw: function (sprite, animation, x, y) {
		if (animation) {
			if (animation.set) {
				// Animated sprite
				Graphics.context.drawImage(sprite.image, animation.x, animation.y, sprite.width, sprite.height, Math.round(x), Math.round(y), sprite.width, sprite.height);
			}
			else {
				// Full sheet
				Graphics.context.drawImage(sprite.image, Math.round(x), Math.round(y), sprite.image.width, sprite.image.height);
			}
		}
		else {
			// Single sprite
			Graphics.context.drawImage(sprite.image, Math.round(x), Math.round(y), sprite.width, sprite.height);
		}
	},

	// Measure framerate
	frameCounter: function () {
		Graphics.fps = Graphics.frames;
		Graphics.frames = 0;
	},

	// Start or stop the fps counter
	fShowFPS: function (state) {
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

// An animation for a sprite sheet
function SpriteAnimation(id, start, end) {
	this.id = id;
	this.start = start;
	this.end = end;
}