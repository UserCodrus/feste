"use strict";

function Sprite(file, sprite_width, sprite_height) {
	// Set the image
	this.image = new Image();
	this.image.src = file;

	// Set the size and location
	this.width = sprite_width;
	this.height = sprite_height;
};

function SpriteSheet(file, sprite_width, sprite_height, sheet_width, sheet_height) {
	Sprite.call(this, file, sprite_width, sprite_height);

	this.cell_width = Math.floor(sheet_width / sprite_width);
	this.cell_height = Math.floor(sheet_height / sprite_height);
}

// Draw the full image
Sprite.prototype.draw = function (x, y) {
	// Draw the sprite
	Game.context.drawImage(this.image, Math.round(x), Math.round(y), this.width, this.height);
};

// Draw a subimage from a sprite sheet
SpriteSheet.prototype.draw = function (x, y, index) {
	let subimage_y = Math.floor(index / this.cell_width);
	let subimage_x = index - subimage_y * this.cell_width;
	
	// Draw a subimage from the sprite
	Game.context.drawImage(this.image, subimage_x, subimage_y, this.width, this.height, x, y, this.width, this.height);
};