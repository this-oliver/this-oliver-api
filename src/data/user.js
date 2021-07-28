// mongo
const User = require("../models/user");

exports.getAllUsers = async () => {
	try {
		const users = await User.find()
			.select("-password -salt")
			.populate("experiences")
			.exec();
		return users;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error, 
		};
	}
};

exports.getUser = async () => {
	try {
		const user = await User.findOne()
			.select("-password -salt")
			.populate("experiences")
			.populate({
				path: "articles",
				match: { publish: true },
			})
			.exec();

		return user;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error,
		};
	}
};

exports.getAdmin = async () => {
	try {
		const user = await User.findOne()
			.select("-password -salt")
			.populate("experiences")
			.populate("articles")
			.exec();

		return user;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error,
		};
	}
};

exports.getSingleUser = async (id) => {
	try {
		const user = await User.findOne({ _id: id })
			.select("-password -salt")
			.populate("experiences")
			.populate({
				path: "articles",
				populate: { path: "author tags" },
			})
			.exec();
		return user;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error, 
		};
	}
};

exports.updateUser = async (id, patch) => {
	try {
		let user = await this.getSingleUser(id);

		if (user == null)
			throw {
				status: 404,
				message: `user ${id} does not exist`, 
			};

		if (patch.email && patch.email !== user.email) {
			const emailExists = await User.findOne({ email: patch.email }).exec();

			if (emailExists) {
				throw {
					status: 404,
					message: `${patch.email} already exists`, 
				};
			}

			user.email = patch.email || user.email;
		}

		user.name = patch.name || user.name;
		
		if(patch.bio){
			user.bio.short = patch.bio.short || user.bio.short;
			user.bio.long = patch.bio.long || user.bio.long;
		}

		user = await user.save();
		return user;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error, 
		};
	}
};

exports.updateUserPassword = async (userId, oldPwd, newPwd) => {
	try {
		let user = await User.findOne({ _id: userId });
		const match = await user.verifyPassword(oldPwd);
		if (!match) {
			throw {
				status: 400,
				message: "invalid credentials", 
			};
		}

		user.password = newPwd;
		user.save();
		user = await User.findOne({ _id: userId });

		return user;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error, 
		};
	}
};

exports.deleteUser = async (id) => {
	try {
		const user = await this.getSingleUser(id);

		if (user == null) {
			throw {
				status: 404,
				message: `user ${id} doesn't exists`, 
			};
		}
		await user.remove();

		return `${id} deleted`;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error, 
		};
	}
};
