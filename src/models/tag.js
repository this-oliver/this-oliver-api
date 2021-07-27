// data
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const tag = new Schema(
	{ name: { type: String, required: true, unique: true } },
	{ timestamps: true }
);

module.exports = Mongoose.model("tag", tag);
