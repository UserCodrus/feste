"use strict";

var SpriteEditor = {
	// The currently selected sprite
	selected_sprite: null,
	selected_animation: null,

	begin: function () {
		// Load graphics data
		getJSON("data/graphics.json", SpriteEditor.initialize);
	},

	initialize: function (json) {
		// Load the json data
		Graphics.load(json);
		
		// Load sprite options
		SpriteEditor.loadSelections();

		// Hide tabs
		SpriteEditor.selectSprite();
	},

	loadSelections: function () {
		// Load sprite from the graphics system
		let list = document.getElementById("select");
		list.options.length = 0;
		for (var i = 0; i < Graphics.sprites.length; ++i) {
			let opt = document.createElement("option");
			opt.value = Graphics.sprites[i].id;
			opt.innerHTML = Graphics.sprites[i].id;
			list.appendChild(opt);
		}
	},

	loadAnimations: function () {
		let list = document.getElementById("animation");
		list.options.length = 0;

		// Load animation data from the selected sprite
		if (SpriteEditor.selected_sprite.animation) {
			for (var i = 0; i < SpriteEditor.selected_sprite.animation.length; ++i) {
				let opt = document.createElement("option");
				opt.value = SpriteEditor.selected_sprite.animation[i].id;
				opt.innerHTML = SpriteEditor.selected_sprite.animation[i].id;
				list.appendChild(opt);
			}
		}
	},

	newSprite: function () {
		Graphics.sprites.push(new Sprite("newsprite", "", 0, 0));

		SpriteEditor.loadSelections();
	},

	newAnimation: function () {
		SpriteEditor.selected_sprite.animation.push(new SpriteAnimation("newanimation", 0, 1));

		SpriteEditor.loadAnimations();
	},

	deleteSprite: function () {
		alert('Not yet available');
	},

	deleteAnimation: function () {
		alert('Not yet available');
	},

	selectSprite: function () {
		// Find the sprite with the matching id
		let select = document.getElementById("select");
		SpriteEditor.selected_sprite = Graphics.sprites[select.selectedIndex];

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

		SpriteEditor.hideTabs();
	},

	selectAnimation: function () {
		if (SpriteEditor.selected_sprite.animation) {
			let select = document.getElementById("animation");
			SpriteEditor.selected_animation = SpriteEditor.selected_sprite.animation[select.selectedIndex];

			document.forms["sprites"]["anim_id"].value = SpriteEditor.selected_animation.id;
			document.forms["sprites"]["anim_start"].value = SpriteEditor.selected_animation.start;
			document.forms["sprites"]["anim_end"].value = SpriteEditor.selected_animation.end;
		}
		else {
			document.forms["sprites"]["anim_id"].value = "";
			document.forms["sprites"]["anim_start"].value = 0;
			document.forms["sprites"]["anim_end"].value = 0;
		}
	},

	editSprite: function () {
		// Change the ID
		if (SpriteEditor.selected_sprite.id != document.forms["sprites"]["id"].value) {
			let id = document.forms["sprites"]["id"].value;

			// Change the selection box
			let list = document.getElementById("select");
			list.options[list.selectedIndex].value = id;
			list.options[list.selectedIndex].innerHTML = id;

			// Change the sprite
			SpriteEditor.selected_sprite.id = id;
		}

		// Change the sprite type
		SpriteEditor.selected_sprite.type = document.forms["sprites"]["type"].value;

		// Add or remove background data
		if (SpriteEditor.selected_sprite.type == "background") {
			// Add background properties
			if (!SpriteEditor.selected_sprite.parallax) {
				// Reset forms to their default value
				document.forms["sprites"]["parallax"].value = 0;
			}
			
			SpriteEditor.selected_sprite.parallax = document.forms["sprites"]["parallax"].value;
		}
		else {
			// Delete uneeded properties
			if (SpriteEditor.selected_sprite.parallax) {
				delete SpriteEditor.selected_sprite.parallax;
			}

			// Reset forms to their default value
			document.forms["sprites"]["parallax"].value = 0;
		}

		// Add or remove sprite sheet data
		if (SpriteEditor.selected_sprite.type == "sheet") {
			// Add a sheet object
			if (!SpriteEditor.selected_sprite.sheet) {
				SpriteEditor.selected_sprite.sheet = new Object();

				// Reset the forms to their default value
				document.forms["sprites"]["sheet_width"].value = 1;
				document.forms["sprites"]["sheet_height"].value = 1;
				document.forms["sprites"]["xoffset"].value = 0;
				document.forms["sprites"]["yoffset"].value = 0;
				document.forms["sprites"]["xstride"].value = 0;
				document.forms["sprites"]["ystride"].value = 0;
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
		}
		else {
			// Delete unneeded properties
			if (SpriteEditor.selected_sprite.sheet) {
				delete SpriteEditor.selected_sprite.sheet;
			}
			if (SpriteEditor.selected_sprite.animation) {
				delete SpriteEditor.selected_sprite.animation;
			}

			// Reset the forms to their default value
			document.forms["sprites"]["sheet_width"].value = 1;
			document.forms["sprites"]["sheet_height"].value = 1;
			document.forms["sprites"]["xoffset"].value = 0;
			document.forms["sprites"]["yoffset"].value = 0;
			document.forms["sprites"]["xstride"].value = 0;
			document.forms["sprites"]["ystride"].value = 0;
		}

		// Change common values
		SpriteEditor.selected_sprite.file = document.forms["sprites"]["file"].value;
		SpriteEditor.selected_sprite.width = document.forms["sprites"]["width"].value;
		SpriteEditor.selected_sprite.height = document.forms["sprites"]["height"].value;

		SpriteEditor.hideTabs();
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
		}

		// Update frame data
		SpriteEditor.selected_animation.start = document.forms["sprites"]["anim_start"].value;
		SpriteEditor.selected_animation.end = document.forms["sprites"]["anim_end"].value;
	},

	hideTabs: function () {
		// Get the selected type
		let type = document.forms["sprites"]["type"].value;

		// Hide unneeded tabs
		let tab = document.getElementById("animation_tab");
		if (type == "sheet") {
			tab.style.display = "block";
		}
		else {
			tab.style.display = "none";
		}

		tab = document.getElementById("sheet_tab");
		if (type == "sheet") {
			tab.style.display = "block";
		}
		else {
			tab.style.display = "none";
		}

		tab = document.getElementById("background_tab");
		if (type == "background") {
			tab.style.display = "block";
		}
		else {
			tab.style.display = "none";
		}
	}
}