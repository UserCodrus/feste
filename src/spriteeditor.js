"use strict";

var SpriteEditor = {
	// The currently selected sprite
	selected_sprite: null,
	// The currently selected animation
	selected_animation: null,

	// The game object that displays the current sprite
	mannequin: null,

	// The zoom level of the editor window
	zoom: 2,

	// The dimensions of the editor window
	editor_width: 0,
	editor_height: 0,

	begin: function () {
		// Set the game's main loading system to use the editor version
		Game.load = SpriteEditor.load;

		// Start the game
		let canvas = document.getElementById("canvas");
		Game.begin("canvas", canvas.clientWidth, canvas.clientHeight);
	},

	load: function () {
		if (Graphics.ready) {
			Game.ready = true;

			// Load system objects

			// Editor controls
			let controller = new GameObject(0, 0, null, null);
			controller.keydown_zoomin = false;
			controller.keydown_zoomout = false;
			controller.keydown_zoomreset = false;
			controller.onFrameUpdate = SpriteEditor.keyboardControls;
			Game.objects.push(controller);

			// Window resizer
			controller = new GameObject(0, 0, null, null);
			controller.onFrameUpdate = SpriteEditor.resizeWindow;
			Game.objects.push(controller);

			// Sprite display
			SpriteEditor.mannequin = new GameObject(0, 0, null, null);
			SpriteEditor.mannequin.keydown_anim = false;
			SpriteEditor.mannequin.onFrameUpdate = function (delta) {
				// Swap between sprite view and animation view
				if (this.sprite.animation) {
					if (Input.keys[Keyboard.key_a]) {
						if (!this.keydown_anim) {
							// Set the animation for this object
							if (this.animation.set) {
								this.setAnimation(null);
							} else {
								if (SpriteEditor.selected_animation) {
									this.setAnimation(SpriteEditor.selected_animation.id);
								}
							}

							this.keydown_anim = true;
						}
					} else {
						this.keydown_anim = false;
					}
				}

				// Position the mannequin
				if (!this.sprite.sheet || this.animation.set) {
					this.x = Graphics.canvas.width / 2 - this.sprite.width / 2;
					this.y = Graphics.canvas.height / 2 - this.sprite.height / 2;
				} else {
					this.x = Graphics.canvas.width / 2 - this.sprite.image.width / 2;
					this.y = Graphics.canvas.height / 2 - this.sprite.image.height / 2;
				}
			}
			Game.objects.push(SpriteEditor.mannequin);

			// Load sprite options
			SpriteEditor.loadSelections();
		}
	},

	// Load sprites into the sprites selection box
	loadSelections: function (select) {
		// Sort sprites
		Graphics.sprites.sort(function (a, b) {
			return (a.id > b.id) - (a.id < b.id);
		});

		// Load sprite from the graphics system
		let list = document.getElementById("select");
		list.options.length = 0;
		for (var i = 0; i < Graphics.sprites.length; ++i) {
			let opt = document.createElement("option");
			opt.value = Graphics.sprites[i].id;
			opt.innerHTML = Graphics.sprites[i].id;
			list.appendChild(opt);

			if (select) {
				if (opt.value == select) {
					list.selectedIndex = i;
				}
			}
		}

		// Load the selected sprite
		SpriteEditor.selectSprite();
	},

	// Load the current sprite's animations into the animation selection box
	loadAnimations: function (select) {
		let list = document.getElementById("animation");
		list.options.length = 0;

		if (SpriteEditor.selected_sprite.animation) {
			// Sort animations
			SpriteEditor.selected_sprite.animation.sort(function (a, b) {
				return (a.id > b.id) - (a.id < b.id);
			});

			// Load animation data from the selected sprite
			for (var i = 0; i < SpriteEditor.selected_sprite.animation.length; ++i) {
				let opt = document.createElement("option");
				opt.value = SpriteEditor.selected_sprite.animation[i].id;
				opt.innerHTML = SpriteEditor.selected_sprite.animation[i].id;
				list.appendChild(opt);

				if (select) {
					if (opt.value == select) {
						list.selectedIndex = i;
					}
				}
			}

			// Load the selected animation
			SpriteEditor.selectAnimation();
		}
	},

	newSprite: function () {
		let id = prompt("Enter a new ID");

		if (id) {
			Graphics.sprites.push(new Sprite(id, "", 1, 1));

			SpriteEditor.loadSelections(id);
		}
	},

	newAnimation: function () {
		let id = prompt("Enter a new ID");

		if (id) {
			SpriteEditor.selected_sprite.animation.push(new SpriteAnimation(id, 0, 1));

			SpriteEditor.loadAnimations(id);
		}
	},

	deleteSprite: function () {
		if (SpriteEditor.selected_sprite) {
			if (confirm("Are you sure you want to delete '" + SpriteEditor.selected_sprite.id + "'?")) {
				// Remove the selected sprite
				let select = document.getElementById("select");
				Graphics.sprites.splice(select.selectedIndex, 1);

				// Reload the selection list
				SpriteEditor.loadSelections();
			}
		}
	},

	deleteAnimation: function () {
		if (SpriteEditor.selected_animation) {
			if (confirm("Are you sure you want to delete '" + SpriteEditor.selected_animation.id + "'?")) {
				// Remove the selected animation
				let select = document.getElementById("animation");
				SpriteEditor.selected_sprite.animation.splice(select.selectedIndex, 1);

				// Reload the selection list
				SpriteEditor.loadAnimations();
			}
		}
	},

	// Load the sprite with the id matching the selection box into the editor forms
	selectSprite: function () {
		// Find the sprite with the matching id
		let select = document.getElementById("select");
		SpriteEditor.selected_sprite = Graphics.sprites[select.selectedIndex];

		if (SpriteEditor.selected_sprite) {
			document.forms["sprites"]["id"].value = SpriteEditor.selected_sprite.id;
			document.forms["sprites"]["type"].value = SpriteEditor.selected_sprite.type;
			document.forms["sprites"]["file"].value = SpriteEditor.selected_sprite.file;
			document.forms["sprites"]["width"].value = SpriteEditor.selected_sprite.width;
			document.forms["sprites"]["height"].value = SpriteEditor.selected_sprite.height;

			document.forms["sprites"]["parallax"].value = SpriteEditor.selected_sprite.parallax;

			if (SpriteEditor.selected_sprite.sheet) {
				document.forms["sprites"]["sheet_width"].value = SpriteEditor.selected_sprite.sheet.width;
				document.forms["sprites"]["sheet_height"].value = SpriteEditor.selected_sprite.sheet.height;
			}

			// Set the display sprite
			SpriteEditor.mannequin.sprite = Graphics.getSprite(SpriteEditor.selected_sprite.id);

			// Reset the sprite's animation
			SpriteEditor.mannequin.setAnimation(null);

			// Load animation data
			SpriteEditor.loadAnimations();
			SpriteEditor.selectAnimation();
		} else {
			SpriteEditor.resetTabSprite();
		}

		SpriteEditor.hideTabs();
	},

	// Load the animation with the id matching the selection box into the editor forms
	selectAnimation: function () {
		SpriteEditor.selected_animation = null;
		SpriteEditor.resetTabAnimation();

		if (SpriteEditor.selected_sprite.animation) {
			let select = document.getElementById("animation");
			SpriteEditor.selected_animation = SpriteEditor.selected_sprite.animation[select.selectedIndex];

			if (SpriteEditor.selected_animation) {
				document.forms["sprites"]["anim_id"].value = SpriteEditor.selected_animation.id;
				document.forms["sprites"]["anim_start"].value = SpriteEditor.selected_animation.start;
				document.forms["sprites"]["anim_end"].value = SpriteEditor.selected_animation.end;

				if (SpriteEditor.mannequin.animation.set) {
					SpriteEditor.mannequin.setAnimation(SpriteEditor.selected_animation.id);
				}
			} else {
				if (SpriteEditor.mannequin.animation.set) {
					SpriteEditor.mannequin.setAnimation(null);
				}
			}
		}
	},

	editSprite: function () {
		if (SpriteEditor.selected_sprite) {
			// Change the ID
			if (SpriteEditor.selected_sprite.id != document.forms["sprites"]["id"].value) {
				let id = document.forms["sprites"]["id"].value;

				// Change the selection box
				let list = document.getElementById("select");
				list.options[list.selectedIndex].value = id;
				list.options[list.selectedIndex].innerHTML = id;

				// Change the sprite
				SpriteEditor.selected_sprite.id = id;

				SpriteEditor.loadSelections(id);
			}

			// Change the sprite type
			SpriteEditor.selected_sprite.type = document.forms["sprites"]["type"].value;

			// Add or remove background data
			if (SpriteEditor.selected_sprite.type == "background") {
				// Add background properties
				if (!SpriteEditor.selected_sprite.parallax) {
					// Reset forms to their default value
					SpriteEditor.resetTabBackground();
				}

				SpriteEditor.selected_sprite.parallax = document.forms["sprites"]["parallax"].value;
			}
			else {
				// Delete uneeded properties
				if (SpriteEditor.selected_sprite.parallax) {
					delete SpriteEditor.selected_sprite.parallax;
				}

				// Reset forms to their default value
				SpriteEditor.resetTabBackground();
			}

			// Add or remove sprite sheet data
			if (SpriteEditor.selected_sprite.type == "sheet") {
				// Add a sheet object
				if (!SpriteEditor.selected_sprite.sheet) {
					SpriteEditor.selected_sprite.sheet = new Object();

					// Reset the forms to their default value
					SpriteEditor.resetTabSheet();
				}

				SpriteEditor.selected_sprite.sheet.width = document.forms["sprites"]["sheet_width"].value;
				SpriteEditor.selected_sprite.sheet.height = document.forms["sprites"]["sheet_height"].value;
				SpriteEditor.selected_sprite.sheet.xoffset = document.forms["sprites"]["xoffset"].value;
				SpriteEditor.selected_sprite.sheet.yoffset = document.forms["sprites"]["yoffset"].value;
				SpriteEditor.selected_sprite.sheet.xstride = document.forms["sprites"]["xstride"].value;
				SpriteEditor.selected_sprite.sheet.ystride = document.forms["sprites"]["ystride"].value;

				// Add an animation array
				if (!SpriteEditor.selected_sprite.animation) {
					SpriteEditor.selected_sprite.animation = [];
				}
			} else {
				// Delete unneeded properties
				if (SpriteEditor.selected_sprite.sheet) {
					delete SpriteEditor.selected_sprite.sheet;
				}
				if (SpriteEditor.selected_sprite.animation) {
					delete SpriteEditor.selected_sprite.animation;
				}

				// Reset the forms to their default value
				SpriteEditor.resetTabSheet();
			}

			// Change the sprite's file
			SpriteEditor.selected_sprite.file = document.forms["sprites"]["file"].value;

			// Change size values
			SpriteEditor.selected_sprite.width = document.forms["sprites"]["width"].value;
			SpriteEditor.selected_sprite.height = document.forms["sprites"]["height"].value;

			SpriteEditor.hideTabs();
		} else {
			SpriteEditor.resetTabSprite();
		}
	},

	editAnimation: function () {
		// Update animation id
		if (SpriteEditor.selected_animation.id != document.forms["sprites"]["anim_id"].value) {
			let id = document.forms["sprites"]["anim_id"].value;

			// Change the selection box
			let list = document.getElementById("animation");
			list.options[list.selectedIndex].value = id;
			list.options[list.selectedIndex].innerHTML = id;

			// Change the animation
			SpriteEditor.selected_animation.id = id;
			SpriteEditor.loadAnimations(id);
		}

		// Update frame data
		SpriteEditor.selected_animation.start = document.forms["sprites"]["anim_start"].value;
		SpriteEditor.selected_animation.end = document.forms["sprites"]["anim_end"].value;
	},

	// Hide unneeded tabs
	hideTabs: function () {
		// Get the selected type
		let type = document.forms["sprites"]["type"].value;

		// Hide unneeded tabs
		let tab = document.getElementById("animation_tab");
		if (type == "sheet") {
			tab.style.display = "block";
		} else {
			tab.style.display = "none";
		}

		tab = document.getElementById("sheet_tab");
		if (type == "sheet") {
			tab.style.display = "block";
		} else {
			tab.style.display = "none";
		}

		tab = document.getElementById("background_tab");
		if (type == "background") {
			tab.style.display = "block";
		} else {
			tab.style.display = "none";
		}
	},

	// Editor keyboad controls
	keyboardControls: function () {
		// Zoom in
		if (Input.keys[Keyboard.key_equals]) {
			if (!this.keydown_zoomin) {
				if (Input.keys[Keyboard.key_shift]) {
					SpriteEditor.zoom += 0.5;
				} else {
					SpriteEditor.zoom += 0.1;
				}

				if (SpriteEditor.zoom > 10) {
					SpriteEditor.zoom = 10;
				}

				// Force canvas resizing
				SpriteEditor.editor_width = 0;

				this.keydown_zoomin = true;
			}
		} else {
			this.keydown_zoomin = false;
		}

		// Zoom out
		if (Input.keys[Keyboard.key_dash]) {
			if (!this.keydown_zoomout) {
				if (Input.keys[Keyboard.key_shift]) {
					SpriteEditor.zoom -= 0.5;
				} else {
					SpriteEditor.zoom -= 0.1;
				}

				if (SpriteEditor.zoom < 0) {
					SpriteEditor.zoom = 0;
				}

				// Force canvas resizing
				SpriteEditor.editor_width = 0;

				this.keydown_zoomout = true;
			}
		} else {
			this.keydown_zoomout = false;
		}

		// Reset zoom level
		if (Input.keys[Keyboard.key_backspace]) {
			if (!this.keydown_zoomreset) {
				SpriteEditor.zoom = 2;

				// Force canvas resizing
				SpriteEditor.editor_width = 0;

				this.keydown_zoomreset = true;
			}
		} else {
			this.keydown_zoomreset = false;
		}
	},

	// Resize the editor window
	resizeWindow: function () {
		if (SpriteEditor.editor_width != Graphics.canvas.clientWidth || SpriteEditor.editor_height != Graphics.canvas.clientHeight) {
			SpriteEditor.editor_width = canvas.clientWidth;
			SpriteEditor.editor_height = canvas.clientHeight;

			Graphics.canvas.width = SpriteEditor.editor_width / SpriteEditor.zoom;
			Graphics.canvas.height = SpriteEditor.editor_height / SpriteEditor.zoom;
		}
	},

	// Reset tabs with their default values
	resetTabSprite: function () {
		document.forms["sprites"]["id"].value = "";
		document.forms["sprites"]["type"].value = "sprite";
		document.forms["sprites"]["file"].value = "";
		document.forms["sprites"]["width"].value = 1;
		document.forms["sprites"]["height"].value = 1;
	},

	resetTabBackground: function () {
		document.forms["sprites"]["parallax"].value = 0;
	},

	resetTabSheet: function () {
		document.forms["sprites"]["sheet_width"].value = 1;
		document.forms["sprites"]["sheet_height"].value = 1;
		document.forms["sprites"]["xoffset"].value = 0;
		document.forms["sprites"]["yoffset"].value = 0;
		document.forms["sprites"]["xstride"].value = 0;
		document.forms["sprites"]["ystride"].value = 0;
	},

	resetTabAnimation: function () {
		document.forms["sprites"]["anim_id"].value = "";
		document.forms["sprites"]["anim_start"].value = 0;
		document.forms["sprites"]["anim_end"].value = 0;
	}
}