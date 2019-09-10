"use strict";

// An immobile object
function Static(x, y, sprite_id, collision) {
	this.x = x;
	this.y = y;

	// Set the sprite
	if (sprite_id) {
		this.sprite = Graphics.getSprite(sprite_id);
	}

	// Set the collision box
	this.hitbox = collision;
	this.hitbox.x = this.x;
	this.hitbox.y = this.y;
};

// A mobile object with physics
var Entity = function (x, y, sprite_id, collision) {
	Static.call(this, x, y, sprite_id, collision);

	this.x_velocity = 0;
	this.y_velocity = 0;
};

// Called every frame when the object updates
Entity.prototype.onFrameUpdate = function (delta) {

}

// Called when the entity collides with an object
Entity.prototype.onCollision = function (object) {

}

// Check for collision with other objects
Entity.prototype.collision = function (x_offset, y_offset) {
	let obj;
	for (obj of Game.static) {
		if (this.hitbox.boxCollision(obj.hitbox, x_offset, y_offset)) {
			return obj;
		}
	}
	return null;
}

// The main update function
Entity.prototype.update = function (delta) {
	// Call the frame update callback
	this.onFrameUpdate(delta);

	// Update the position of the collision box and sprite
	this.hitbox.x = this.x;
	this.hitbox.y = this.y;

	// Detect collisions
	let x_collide = false;
	let y_collide = false;
	// X Axis
	let obj = this.collision(this.x_velocity, 0);
	if (obj) {
		x_collide = true;
		this.onCollision(obj);
	}
	// Y Axis
	obj = this.collision(0, this.y_velocity);
	if (obj) {
		y_collide = true;
		this.onCollision(obj);
	}

	// Move the entity
	if (!x_collide) {
		this.x += this.x_velocity;
	}
	if (!y_collide) {
		this.y += this.y_velocity;
	}
};