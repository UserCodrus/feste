"use strict";

// Test data for building the editor
var TestObject = function(x, y, sprite_id, collision) {
	GameObject.call(this, x, y, sprite_id, collision);

	this.hp = 100;
}

TestObject.prototype = Object.create(GameObject.prototype);
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
			let animate = new GameObject(50, 50, "guy", new BoundingBox(16, 16));
			Game.objects.push(animate);
			Game.objects.push(new GameObject(0, 240, null, new BoundingBox(320, 10)));
			Game.objects.push(new GameObject(0, -10, null, new BoundingBox(320, 10)));
			Game.objects.push(new GameObject(320, 0, null, new BoundingBox(10, 240)));
			Game.objects.push(new GameObject(-10, 0, null, new BoundingBox(10, 240)));

			// Test character callbacks
			animate = new GameObject(150, 50, "box", new BoundingBox(16, 16));
			animate.setAnimation("bloop");
			Game.objects.push(animate);
			animate = new GameObject(150, 150, "box", new BoundingBox(16, 16));
			Game.objects.push(animate);
			let character = new TestObject(100, 100, "guy", new BoundingBox(16, 16));
			Game.objects.push(character);
		}
	};

	// Start the game
	Game.begin("canvas", 320, 240);
}