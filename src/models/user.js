// data
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

//auth
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const user = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		bio: {
			short: { type: String, default: "" },
			long: { type: String, default: "" }, 
		},
		experiences: [{ type: Schema.Types.ObjectId, ref: "experience" }],
		articles: [{ type: Schema.Types.ObjectId, ref: "article" }],
		salt: { type: String }, 
	},
	{ timestamps: true }
);

user.pre("save", async function (next) {
	const thisUser = this;
	// only hash the password if it has been modified (or is new)
	if (!thisUser.isModified("password")) return next();

	try {
		// generate a salt
		const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		thisUser.salt = salt;
		// hash the password along with our new salt
		const hash = await bcrypt.hash(thisUser.password, salt);
		// override the cleartext password with the hashed one
		thisUser.password = hash;
		next();
	} catch (error) {
		return next(error);
	}
});

user.methods.verifyPassword = async function (candidate) {
	const thisUser = this;
	try {
		const isMatch = await bcrypt.compare(candidate, thisUser.password);
		return Promise.resolve(isMatch);
	} catch (error) {
		throw Promise.reject({ status: 500, message: error });
	}
};

module.exports = Mongoose.model("user", user);
