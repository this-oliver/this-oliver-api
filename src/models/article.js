// data
let Mongoose = require("mongoose");
let Schema = Mongoose.Schema;

let article = new Schema(
	{
		/* general */
		title: { type: String, required: true },
		content: { type: String, required: true },
		publish: { type: String, default: false },
		author: { type: Schema.Types.ObjectId, ref: "user" },
		tags: [{ type: Schema.Types.ObjectId, ref: "tag" }],
	},
	{ timestamps: true }
);

module.exports = Mongoose.model("article", article);
