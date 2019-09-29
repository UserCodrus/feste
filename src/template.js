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
	if (Input.keys[Keyboard.key_shift] || Input.buttons[Gamepad.button_rtrigger]) {
		speed *= 2;
	}

	// Horizontal movement
	if (Input.keys[Keyboard.key_a] || Input.buttons[Gamepad.button_dpad_left]) {
		this.x_velocity = -speed;
	}
	else if (Input.keys[Keyboard.key_d] || Input.buttons[Gamepad.button_dpad_right]) {
		this.x_velocity = speed;
	}
	else {
		this.x_velocity = 0;
	}
	// Vertical movement
	if (Input.keys[Keyboard.key_w] || Input.buttons[Gamepad.button_dpad_up]) {
		this.y_velocity = -speed;
	}
	else if (Input.keys[Keyboard.key_s] || Input.buttons[Gamepad.button_dpad_down]) {
		this.y_velocity = speed;
	}
	else {
		this.y_velocity = 0;
	}
}

function startGame() {
	// Measure framerate
	Graphics.fShowFPS(true);

	// Show bounding boxes
	Graphics.show_collision = true;

	// Create a dummy load function for loading test game data
	Game.load = function () {
		// Start the game when everything is loaded
		if (Graphics.ready) {
			Game.ready = true;

			// Test backgrounds
			Game.background.push(Graphics.getSprite("back"));

			// Test static collision
			Game.objects.push(new GameObject(50, 50, "guy", new BoundingBox(16, 16)));
			Game.objects.push(new GameObject(0, 239, null, new BoundingBox(320, 10)));
			Game.objects.push(new GameObject(0, -9, null, new BoundingBox(320, 10)));
			Game.objects.push(new GameObject(319, 0, null, new BoundingBox(10, 240)));
			Game.objects.push(new GameObject(-9, 0, null, new BoundingBox(10, 240)));

			// Test character callbacks
			let obj = new GameObject(150, 50, "box", new BoundingBox(16, 16));
			obj.setAnimation("bloop");
			Game.objects.push(obj);
			obj = new GameObject(150, 150, "box", new BoundingBox(16, 16));
			obj.solid = false;
			Game.objects.push(obj);
			let character = new TestObject(100, 100, "guy", new BoundingBox(16, 16));
			Game.objects.push(character);
		}
	};

	// Start the game
	Game.begin("canvas", 320, 240);
}