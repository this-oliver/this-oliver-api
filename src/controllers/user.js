// data
const UserData = require("../data/user");
const ArticleData = require("../data/article");
// helpers
const TokenHelper = require("../helpers/token");

exports.getAllUsers = async function (req, res) {
	let users = null;

	try {
		users = await UserData.getAllUsers();
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	return res.status(200).send(users);
};

exports.getSingleUser = async function (req, res) {
	const userId = req.params.userId;
	let user = null;

	try {
		user = await UserData.getSingleUser(userId);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	if (user === null) {
		return res.status(404).send(`user ${userId} not found`);
	} else {
		return res.status(200).send(user);
	}
};

exports.getUserArticles = async function (req, res) {
	const userId = req.params.userId;

	try {
		const articles = await ArticleData.getUserArticles(userId);
		return res.status(200).send(articles);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.getSecretUserArticles = async function (req, res) {
	const userId = req.params.userId;
	let user = null;

	try {
		const decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);

		user = await UserData.getSingleUser(userId);

		if (user._id != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials", 
			};
		}

	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	try {
		const articles = await ArticleData.getUserArticles(user._id, true);
		return res.status(200).send(articles);
		
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.patchUser = async function (req, res) {
	const userId = req.params.userId;
	let user = null;
	const patch = req.body;

	try {
		const decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);

		user = await UserData.getSingleUser(userId);
		
		if (user._id != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials", 
			};
		}

	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	try {
		user = await UserData.updateUser(user._id, patch);
		return res.status(200).send(user);

	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.deleteUser = async function (req, res) {
	const userId = req.params.userId;
	let user = null;

	try {
		const decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);

		user = await UserData.getSingleUser(userId);
		
		if (user._id != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials", 
			};
		}

		await UserData.deleteUser(user._id);
		return res.status(200).send(`deleted ${userId}`);

	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
