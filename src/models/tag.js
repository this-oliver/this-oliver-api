// data
const colorHelper = require("../helpers/color");
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const tag = new Schema(
	{
		name: { type: String, required: true, unique: true },
		color: { type: String, unique: true },
	},
	{ timestamps: true }
);

tag.pre('save', function(next){
	this.color = colorHelper.getRandomColor({ light: true });
	return next();
});

module.exports = Mongoose.model("tag", tag);
