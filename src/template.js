"use strict";

// Test data for building the editor
var TestObject = function(x, y, sprite_id, collision) {
	Entity.call(this, x, y, sprite_id, collision);

	this.hp = 100;
}

TestObject.prototype = Object.create(Entity.prototype);
TestObject.prototype.constructor = TestObject;

TestObject.prototype.onFrameUpdate = function (delta) {
	// Set speed
	let speed = 32 * delta;
	if (Input.keys[Keyboard.key_shift]) {
		speed *= 2;
	}

	// Horizontal movement
	if (Input.keys[Keyboard.key_a]) {
		this.x_velocity = -speed;
	}
	else if (Input.keys[Keyboard.key_d]) {
		this.x_velocity = speed;
	}
	else {
		this.x_velocity = 0;
	}
	// Vertical movement
	if (Input.keys[Keyboard.key_w]) {
		this.y_velocity = -speed;
	}
	else if (Input.keys[Keyboard.key_s]) {
		this.y_velocity = speed;
	}
	else {
		this.y_velocity = 0;
	}
}