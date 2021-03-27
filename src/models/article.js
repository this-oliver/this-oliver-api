// data
let Mongoose = require("mongoose");
let Schema = Mongoose.Schema;

let article = new Schema(
	{
		/* general */
		title: { type: String, required: true },
		author: { type: Schema.Types.ObjectId, ref: "user" },
		content: { type: String, required: true },
		tags: [{ type: Schema.Types.ObjectId, ref: "tag" }],
	},
	{ timestamps: true }
);

module.exports = Mongoose.model("article", article);
