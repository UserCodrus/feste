"use strict";

function BoundingBox(x, y, width, height, offset_x = 0, offset_y = 0) {
	// Box attributes
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.offset_x = offset_x;
	this.offset_y = offset_y;
};

// Detect collision with another box
BoundingBox.prototype.boxCollision = function (target, mod_x = 0, mod_y = 0) {
	if (this.x + mod_x < target.x + target.width &&
		this.x + mod_x + this.width > target.x &&
		this.y + mod_y < target.y + target.height &&
		this.y + mod_y + this.height > target.y) {
		return true;
	}
	else {
		return false;
	}
};

// Detect collision with a circle
BoundingBox.prototype.circleCollision = function (target) {
	return false;
}