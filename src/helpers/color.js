const chroma = require("chroma-js");

/**
 * Returns random color in hex format
 * @param {Object} options - options for color. `dark` (Boolean) darkens the color if true. `light` (Boolean) brightens the color if true.
 * @returns String
 */
exports.getRandomColor = function(options = { dark: false, light: false }) {
	const color = chroma.random();

	if(options.dark){
		color.darken(2);
	}

	if(options.light){
		color.brighten(2);
	}

	return color.hex();
};
