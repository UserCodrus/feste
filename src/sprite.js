"use strict";

var Graphics = {
	location: "",
	sprites: null,
	context: null,

	// Get a sprite with a given id
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
	// Draw a sprite
	draw: function (sprite, x, y, animation) {
		if (animation) {
			Game.context.drawImage(sprite.image, animation.x, animation.y, sprite.width, sprite.height, Math.round(x), Math.round(y), sprite.width, sprite.height);
		} else {
			Game.context.drawImage(sprite.image, Math.round(x), Math.round(y), sprite.width, sprite.height);
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