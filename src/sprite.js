"use strict";

function Sprite(offset_x, offset_y, sprite_width, sprite_height, sheet_width, sheet_height, speed, file) {
	// Set the image
	this.image = new Image();
	this.image.src = file;

	// Set the size and location
	this.x = offset_x;
	this.y = offset_y;
	this.offset_x = offset_x;
	this.offset_y = offset_y;
	this.width = sprite_width;
	this.height = sprite_height;

	this.sheet_width = sheet_width;
	this.sheet_height = sheet_height;

	this.subimage = 0;
	this.skip = 0;
	this.speed = speed;
	this.animated = false;
};

// Draw the full image
Sprite.prototype.draw = function () {
	// Draw the whole sprite
	Game.context.drawImage(this.image, Math.round(this.x), Math.round(this.y), this.width, this.height);
};

// Draw a subimage from a sprite sheet
Sprite.prototype.animate = function () {
	// Draw a subimage from the sprite
	Game.context.drawImage(this.image, this.subimage * this.width, 0, this.width, this.height, Math.round(this.x), Math.round(this.y), this.width, this.height);

	// Increment the animation
	this.skip++;
	if (this.skip >= this.speed) {
		this.skip = 0;

		this.subimage++;
		if (this.subimage * this.width >= this.sheet_width) {
			this.subimage = 0;
		}
	}
};