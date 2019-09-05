"use strict";

// An immobile object
function Static(x, y, sprite, collision) {
	this.x = x;
	this.y = y;

	// Set the sprite
	if (sprite) {
		this.sprite = sprite;
		this.sprite.x = this.x + this.sprite.offset_x;
		this.sprite.y = this.y + this.sprite.offset_y;
	}

	// Set the collision box
	this.collision = collision;
	this.collision.x = this.x + this.collision.offset_x;
	this.collision.y = this.y + this.collision.offset_y;
};

// A mobile object with physics
function Entity(x, y, sprite, collision) {
	Static.call(this, x, y, sprite, collision);

	this.x_velocity = 0;
	this.y_velocity = 0;
};

// Called every frame when the object updates
Entity.prototype.onFrameUpdate = function (delta) {

}

// Called when the entity collides with an object
Entity.prototype.onCollision = function (object) {

}

// The main update function
Entity.prototype.update = function (delta) {
	// Call the frame update callback
	this.onFrameUpdate(delta);

	// Update the position of the collision box and sprite
	this.sprite.x = this.x + this.sprite.offset_x;
	this.sprite.y = this.y + this.sprite.offset_y;
	this.collision.x = this.x + this.collision.offset_x;
	this.collision.y = this.y + this.collision.offset_y;

	// Detect collisions
	let obj = 0;
	let x_collide = false;
	let y_collide = false;
	// X Axis
	for (obj of Game.static) {
		if (this.collision.boxCollision(obj.collision, this.x_velocity, 0)) {
			x_collide = true;
			this.onCollision(obj);
		}
	}
	// Y Axis
	for (obj of Game.static) {
		if (this.collision.boxCollision(obj.collision, 0, this.y_velocity)) {
			y_collide = true;
			this.onCollision(obj);
		}
	}

	// Move the entity
	if (!x_collide) {
		this.x += this.x_velocity;
	}
	if (!y_collide) {
		this.y += this.y_velocity;
	}
};