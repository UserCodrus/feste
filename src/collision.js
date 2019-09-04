"use strict";

function BoundingBox(x, y, width, height) {
	// Box attributes
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	// Detect collision with another box
	this.boxCollision = function (target) {
		if (this.x < target.x + target.width &&
			this.x + this.width > target.x &&
			this.y < target.y + target.height &&
			this.y + this.height > target.y) {
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