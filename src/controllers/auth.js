// data
const AuthData = require("../data/auth");
const UserData = require("../data/user");
// helpers
const TokenHelper = require("../helpers/token");

exports.login = async function (req, res) {
	const data = req.body;
	let user = null;
	let token = null;

	try {
		user = await AuthData.login(data.email, data.password);
		token = TokenHelper.getToken(user._id);
	} catch (error) {
		return res.status(error.status || 500).send(error.message);
	}

	return res.status(200).send({ user: user, token: token });
};

exports.register = async function (req, res) {
	const data = req.body;
	let user = null;

	try {
		user = await AuthData.register(data.name, data.email, data.password);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	return res.status(201).send(user);
};

exports.resetPassword = async function (req, res) {
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;
	let user = null;

	try {
		const decoded = TokenHelper.verifyToken(
			req.headers.authorization.split(" ")[1]
		);

		user = await UserData.getSingleUser(decoded.data);

		if (user._id != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials",
			};
		}

	} catch (error) {
		return res.status(error.status || 401).send(error.message);
	}

	try {
		await UserData.changePassword(user._id, oldPassword, newPassword);
		return res.status(200).send({});
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
