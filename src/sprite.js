"use strict";

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
	this.draw = function () {
		// Draw the whole sprite
		Game.context.drawImage(this.image, Math.round(this.x), Math.round(this.y), this.width, this.height);
	}
	this.animate = function () {
		// Draw a subimage from the sprite
		Game.context.drawImage(this.image, this.subimage * this.width, 0, this.width, this.height, Math.round(this.x), Math.round(this.y), this.width, this.height);

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