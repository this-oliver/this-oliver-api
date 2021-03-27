// data
let Mongoose = require("mongoose");
let Schema = Mongoose.Schema;

//auth
let bcrypt = require("bcrypt");
let SALT_WORK_FACTOR = 10;

let user = new Schema(
	{
		/* general */
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
	let thisUser = this;
	// only hash the password if it has been modified (or is new)
	if (!thisUser.isModified("password")) return next();

	try {
		// generate a salt
		let salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		thisUser.salt = salt;
		// hash the password along with our new salt
		let hash = await bcrypt.hash(thisUser.password, salt);
		// override the cleartext password with the hashed one
		thisUser.password = hash;
		next();
	} catch (error) {
		return next(error);
	}
});

user.post("remove", async function (user, next) {
	// do stuff before removing user
});

user.methods.verifyPassword = async function (candidate) {
	let thisUser = this;
	try {
		let isMatch = await bcrypt.compare(candidate, thisUser.password);
		return Promise.resolve(isMatch);
	} catch (error) {
		throw Promise.reject({ status: 500, message: error });
	}
};

module.exports = Mongoose.model("user", user);
