// data
let Mongoose = require("mongoose");
let Schema = Mongoose.Schema;

let experience = new Schema(
	{
		/* general */
		title: { type: String, required: true },
		org: { type: String, required: true },
		startYear: { type: Number, required: true },
		endYear: { type: Number },
		description: { type: String, required: true },
		type: { type: String, required: true },
		author: { type: Schema.Types.ObjectId, ref: "user" },
	},
	{ timestamps: true }
);

module.exports = Mongoose.model("experience", experience);
