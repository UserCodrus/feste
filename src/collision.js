"use strict";

function BoundingBox(x, y, width, height, solid) {
	// Box attributes
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.solid = false;

	// Detect collision with another box
	this.boxCollision = function (target, mod_x = 0, mod_y = 0) {
		if (this.x + mod_x < target.x + target.width &&
			this.x + mod_x + this.width > target.x &&
			this.y + mod_y < target.y + target.height &&
			this.y + mod_y + this.height > target.y) {
			return true;
		}
		else {
			return false;
		}
	}

	// Detect collision with a circle
	this.circleCollision = function (target) {
		return false;
	}
};