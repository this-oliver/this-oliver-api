// data
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const article = new Schema(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		author: { type: Schema.Types.ObjectId, ref: "user" },
		publish: { type: Boolean, default: false },
		views: { type: Number, default: 0 },
		likes: { type: Number, default: 0 },
		dislikes: { type: Number, default: 0 },
		tags: [{ type: Schema.Types.ObjectId, ref: "tag" }],
	},
	{ timestamps: true }
);

module.exports = Mongoose.model("article", article);
