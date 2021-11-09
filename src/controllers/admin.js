// data
const UserData = require("../data/user");
const ArticleData = require("../data/article");
// helpers
const TokenHelper = require("../helpers/token");

exports.getAdmin = async function (req, res) {
	try {
		const decoded = TokenHelper.verifyToken(
			req.headers.authorization.split(" ")[1]
		);

		const user = await UserData.getUser(true);

		if (!user) {
			throw {
				status: 404,
				message: "user not found",
			};
		}

		if (user._id != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials",
			};
		}

		return res.status(200).send(user);
	} catch (error) {
		return res.status(error.status || 401).send(error.message);
	}
};

exports.getArticles = async function (req, res) {
	let user = null;

	try {
		const decoded = TokenHelper.verifyToken(
			req.headers.authorization.split(" ")[1]
		);

		user = await UserData.getUser();

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
		const articles = await ArticleData.getAllArticles(true);
		return res.status(200).send(articles);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.getSingleArticle = async function (req, res) {
	const articleId = req.params.id;

	try {
		const decoded = TokenHelper.verifyToken(
			req.headers.authorization.split(" ")[1]
		);

		const article = await ArticleData.getSingleArticle(articleId, true);
		if (article.author._id != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials",
			};
		}
	} catch (error) {
		return res.status(error.status || 401).send(error.message);
	}

	try {
		const article = await ArticleData.getSingleArticle(articleId, true);
		return res.status(200).send(article);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.patchAdmin = async function (req, res) {
	let user = null;
	const patch = req.body;

	try {
		const decoded = TokenHelper.verifyToken(
			req.headers.authorization.split(" ")[1]
		);

		user = await UserData.getUser();

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
		user = await UserData.updateUser(user._id, patch);
		return res.status(200).send(user);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
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

exports.deleteAdmin = async function (req, res) {
	const userId = req.params.userId;
	let user = null;

	try {
		const decoded = TokenHelper.verifyToken(
			req.headers.authorization.split(" ")[1]
		);

		user = await UserData.getSingleUser(userId);

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
		await UserData.deleteUser(user._id);
		return res.status(200).send(`deleted ${userId}`);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
