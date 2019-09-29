"use strict";

var Input = {
	// Key states
	keys: [],
	buttons: [],
	axes: [],
	gamepads: [],

	// Key handlers
	keyPress: function (e) {
		Input.keys[e.keyCode] = true;
	},
	keyRelease: function (e) {
		Input.keys[e.keyCode] = false;
	},

	// Gamepad handlers
	gamepadConnect: function (e) {
		if (e.gamepad.mapping == "standard") {
			Input.gamepads[e.gamepad.index] = e.gamepad;

			console.log("Gamepad connected in slot " + e.gamepad.index + ": " + e.gamepad.id);
		} else {
			console.log("Unable to connect gamepad in slot " + e.gamepad.index + ": " + e.gamepad.id + " uses nonstandard layout");
		}
	},
	gamepadDisconnect: function (e) {
		delete Input.gamepads[e.gamepad.index];

		console.log("Gamepad disconnected in slot " + e.gamepad.index + ": " + e.gamepad.id);
	},

	// Query the state of each gamepad
	gamepadQuery: function () {
		// Reset buttons
		var i, j;
		for (i = 0; i < Input.buttons.length; i++) {
			Input.buttons[i] = false;
		}

		// Check the state of every gamepad connected
		for (i = 0; i < Input.gamepads.length; i++) {
			let gp = Input.gamepads[i];
			if (gp) {
				// Store the state of the gamepad buttons
				for (j = 0; j < gp.buttons.length; j++) {
					if (gp.buttons[j].pressed) {
						Input.buttons[j] = true;
					}
				}
			}
		}
	}
}

// Gamepad keycodes
const Gamepad = {
	// XBox semantics
	button_a: 0,
	button_b: 1,
	button_x: 2,
	button_y: 3,
	button_lbutton: 4,
	button_rbutton: 5,
	button_ltrigger: 6,
	button_rtrigger: 7,
	button_back: 8,
	button_start: 9,

	// PlayStation semantics
	button_x: 0,
	button_circle: 1,
	button_square: 2,
	button_triangle: 3,
	button_l1: 4,
	button_r1: 5,
	button_l2: 6,
	button_r2: 7,
	button_select: 8,
	button_start: 9,
	
	button_lclick: 10,
	button_rclick: 11,
	button_dpad_up: 12,
	button_dpad_down: 13,
	button_dpad_left: 14,
	button_dpad_right: 15,
	button_center: 16,

	axis_left_x: 0,
	axis_left_y: 1,
	axis_right_x: 2,
	axis_right_y: 3
}

// Keyboard keycodes
const Keyboard = {
	key_backspace: 8,
	key_tab: 9,
	key_enter: 13,
	key_shift: 16,
	key_ctrl: 17,
	key_alt: 18,
	key_esc: 27,
	key_space: 32,
	key_page_up: 33,
	key_page_down: 34,
	key_end: 35,
	key_home: 36,
	key_left: 37,
	key_up: 38,
	key_right: 39,
	key_down: 40,
	key_insert: 45,
	key_delete: 46,
	key_0: 48,
	key_1: 49,
	key_2: 50,
	key_3: 51,
	key_4: 52,
	key_5: 53,
	key_6: 54,
	key_7: 55,
	key_8: 56,
	key_9: 57,
	key_equals: 61,
	key_a: 65,
	key_b: 66,
	key_c: 67,
	key_d: 68,
	key_e: 69,
	key_f: 70,
	key_g: 71,
	key_h: 72,
	key_i: 73,
	key_j: 74,
	key_k: 75,
	key_l: 76,
	key_m: 77,
	key_n: 78,
	key_o: 79,
	key_p: 80,
	key_q: 81,
	key_r: 82,
	key_s: 83,
	key_t: 84,
	key_u: 85,
	key_v: 86,
	key_w: 87,
	key_x: 88,
	key_y: 89,
	key_z: 90,
	key_num_0: 96,
	key_num_1: 97,
	key_num_2: 98,
	key_num_3: 99,
	key_num_4: 100,
	key_num_5: 101,
	key_num_6: 102,
	key_num_7: 103,
	key_num_8: 104,
	key_num_9: 105,
	key_num_multiply: 106,
	key_num_add: 107,
	key_num_subtract: 109,
	key_num_decimal: 110,
	key_num_divide: 111,
	key_f1: 112,
	key_f2: 113,
	key_f3: 114,
	key_f4: 115,
	key_f5: 116,
	key_f6: 117,
	key_f7: 118,
	key_f8: 119,
	key_f9: 120,
	key_f10: 121,
	key_f11: 122,
	key_f12: 123,
	key_dash: 173,
	key_semicolon: 186,
	key_comma: 188,
	key_period: 190,
	key_forward_slash: 191,
	key_tilde: 192,
	key_left_bracket: 219,
	key_back_slash: 220,
	key_right_bracket: 221,
	key_apostrophe: 222
};