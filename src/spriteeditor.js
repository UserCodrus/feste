"use strict";

var SpriteEditor = {
	begin: function () {
		SpriteEditor.hideTabs();
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

		tab = document.getElementById("background_tab");
		if (type == "background") {
			tab.style.display = "table-row";
		}
		else {
			tab.style.display = "none";
		}

		tab = document.getElementById("sheet_width_tab");
		if (type == "sheet") {
			tab.style.display = "table-row";
		}
		else {
			tab.style.display = "none";
		}

		tab = document.getElementById("sheet_height_tab");
		if (type == "sheet") {
			tab.style.display = "table-row";
		}
		else {
			tab.style.display = "none";
		}
	}
}