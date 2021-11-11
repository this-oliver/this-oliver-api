// data
const colorHelper = require("../helpers/color");
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const tag = new Schema(
	{
		name: { type: String, required: true, unique: true },
		color: { type: String, unique: true, default: colorHelper.getRandomColor({ light: true }) }
	},
	{ timestamps: true }
);

module.exports = Mongoose.model("tag", tag);
