// mongo
const UserSchema = require("../models/user");
const UserData = require("./user");

exports.login = async (email, password) => {
	let user;

	try {
		user = await UserSchema.findOne({ email: email.toLowerCase() });

		if (user == null) {
			throw {
				status: 404,
				message: "invalid login details",
			};
		}
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error,
		};
	}

	try {
		const isMatch = await user.verifyPassword(password);
		if (!isMatch) {
			throw {
				status: 404,
				message: "invalid token",
			};
		}
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error,
		};
	}

	try {
		user = await UserData.getSingleUser(user._id);
		return user;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error,
		};
	}
};

exports.register = async (name, email, password) => {
	try {
		const users = await UserData.getAllUsers();

		if (users.length > 0) {
			throw {
				status: 400,
				message: "sorry buddy but there can only be one user in this server 🤪",
			};
		}
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message,
		};
	}

	try {
		const user = await UserSchema.create(
			new UserSchema({
				name: name,
				email: email,
				password: password,
			})
		);

		const result = UserData.getSingleUser(user._id);
		return Promise.resolve(result);
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error,
		};
	}
};
