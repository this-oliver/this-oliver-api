// data
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const article = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	publish: { type: Boolean, default: false },
	author: { type: Schema.Types.ObjectId, ref: "user" },
	tags: [{ type: Schema.Types.ObjectId, ref: "tag" }], 
}, { timestamps: true });

module.exports = Mongoose.model("article", article);
