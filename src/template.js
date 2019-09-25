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

function startGame() {
	// Measure framerate
	Graphics.fShowFPS(true);

	// Create a dummy load function for loading test game data
	Game.load = function () {
		// Start the game when everything is loaded
		if (Graphics.ready) {
			Game.ready = true;

			// Test backgrounds
			Game.background.push(Graphics.getSprite("back"));

			// Test static collision
			let animate = new Static(50, 50, "guy", new BoundingBox(16, 16));
			Game.static.push(animate);
			Game.static.push(new Static(0, 240, null, new BoundingBox(320, 10)));
			Game.static.push(new Static(0, -10, null, new BoundingBox(320, 10)));
			Game.static.push(new Static(320, 0, null, new BoundingBox(10, 240)));
			Game.static.push(new Static(-10, 0, null, new BoundingBox(10, 240)));

			// Test character callbacks
			animate = new Entity(150, 50, "box", new BoundingBox(16, 16));
			animate.setAnimation("bloop");
			Game.entity.push(animate);
			animate = new Entity(150, 150, "box", new BoundingBox(16, 16));
			Game.entity.push(animate);
			let character = new TestObject(100, 100, "guy", new BoundingBox(16, 16));
			Game.entity.push(character);
		}
	};

	// Start the game
	Game.begin("canvas");
}