// data
const User = require("../data/user");
// helpers
const TokenHelper = require("../helpers/token");

exports.postUser = async function (req, res, next) {
	let data = req.body;
	let user = null;

	try {
		user = await User.postUser(data.name, data.email, data.password);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	return res.status(201).send(user);
};

exports.getAllUsers = async function (req, res) {
	let users = null;

	try {
		users = await User.getAllUsers();
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	return res.status(200).send(users);
};

exports.getSingleUser = async function (req, res) {
	let id = req.params.id;
	let user = null;

	try {
		user = await User.getSingleUser(id);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	if (user === null) {
		return res.status(404).send(`user ${id} not found`);
	} else {
		return res.status(200).send(user);
	}
};

exports.patchUser = async function (req, res) {
	let id = req.params.id;
	let user = null;
	let patch = req.body;

	try {
		let decoded = TokenHelper.verifyToken(
			req.headers.authorization.split(" ")[1]
		);

		if (id != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials",
			};
		}
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	try {
		user = await User.updateUser(id, patch);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	return res.status(200).send(user);
};

exports.deleteUser = async function (req, res) {
	let id = req.params.id;

	try {
		let decoded = TokenHelper.verifyToken(
			req.headers.authorization.split(" ")[1]
		);

		if (id != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials",
			};
		}

		await User.deleteUser(id);
		return res.status(200).send(`deleted ${id}`);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
