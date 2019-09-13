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

	// The animation data for this object's sprite
	this.animation = {
		set: null,
		speed: 1,
		frametime: 0,
		index: 0,
		x: 0,
		y: 0
	}
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

	// Update the position of the collision box
	this.hitbox.x = this.x;
	this.hitbox.y = this.y;

	// Advance the animation
	if (this.animation.set) {
		// Advance the frame timer
		this.animation.frametime += delta * this.animation.speed;

		// Cycle to the next frame
		if (this.animation.frametime > (1 / Graphics.sprite_fps)) {
			this.animation.frametime -= 1 / Graphics.sprite_fps;

			this.animation.index++;
			if (this.animation.index > this.animation.set.end) {
				this.animation.index = this.animation.set.start;
			}

			this.getSubimage();
		}
	}

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

// Change the current animation
Entity.prototype.setAnimation = function (animation_id) {
	if (animation_id != null) {
		if (this.sprite.animation && this.sprite.sheet) {
			// Find an animation matching the provided id
			let obj;
			for (obj of this.sprite.animation) {
				if (obj.name == animation_id) {
					// Set the animation data
					this.animation.set = obj;
					this.animation.index = this.animation.set.start;
					this.animation.frametime = 0.0;
					this.getSubimage();

					return;
				}
			}
		}
	}
}

// Get the coordinates of the current subimage of the sprite
Entity.prototype.getSubimage = function () {
	// Get the cell containing the current subimage
	let cy = Math.floor(this.animation.index / this.sprite.sheet.width);
	let cx = this.animation.index - (this.sprite.sheet.width * cy);

	// Get the coordinates of the subimage
	this.animation.y = cy * this.sprite.height;
	this.animation.x = cx * this.sprite.width;
}