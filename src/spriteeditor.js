"use strict";

var SpriteEditor = {
	// The currently selected sprite
	selected_sprite: null,
	selected_animation: null,

	begin: function () {
		// Measure framerate
		Graphics.fShowFPS(true);

		// Set the game's main loading system to use the editor version
		Game.load = SpriteEditor.load;

		// Start the game
		let canvas = document.getElementById("canvas");
		Game.begin("canvas", canvas.clientWidth, canvas.clientHeight);
	},

	load: function () {
		if (Graphics.ready) {
			Game.ready = true;

			// Load sprite options
			SpriteEditor.loadSelections();

			// Hide tabs
			SpriteEditor.selectSprite();
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