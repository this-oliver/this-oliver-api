// data
const User = require("../data/user");
// helpers
const TokenHelper = require("../helpers/token");

exports.loginUser = async function (req, res) {
	const data = req.body;
	let user = null;
	let token = null;

	try {
		user = await User.login(data.email, data.password);
		token = TokenHelper.getToken(user._id);
	} catch (error) {
		return res.status(error.status || 500).send(error.message);
	}

	return res.status(200).send({ user: user, token: token });
};

exports.registerUser = async function (req, res) {
	const data = req.body;
	let user = null;

	try {
		user = await User.postUser(data.name, data.email, data.password);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	return res.status(201).send(user);
};

exports.resetPassword = async function (req, res) {
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;

	try {
		const user = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);
		await User.changePassword(user._id, oldPassword, newPassword);
		return res.status(200).send({});

	} catch (error) {
		return res.status(error.status || 500).send(error.message);
	}
};
