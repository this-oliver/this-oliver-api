// data
let Mongoose = require("mongoose");
let Schema = Mongoose.Schema;

let tag = new Schema(
	{
		/* general */
		name: { type: String, required: true, unique: true },
	},
	{ timestamps: true }
);

module.exports = Mongoose.model("tag", tag);
