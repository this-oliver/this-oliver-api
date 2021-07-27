const ArticleData = require("../data/article");

const TokenHelper = require("../helpers/token");

exports.postArticle = async function (req, res) {
	let data = req.body;
	let userId = null;

	try {
		userId = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	try {
		let article = await ArticleData.postArticle(userId, data.title, data.content, data.tags, data.publish);
		return res.status(201).send(article);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.getAllArticles = async function (req, res) {
	try {
		let articles = await ArticleData.getAllArticles();
		return res.status(200).send(articles);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.getSingleArticle = async function (req, res) {
	let articleId = req.params.articleId;

	try {
		let article = await ArticleData.getSingleArticle(articleId);
		return res.status(200).send(article);
		
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.getSecretSingleArticle = async function (req, res) {
	let articleId = req.params.articleId;

	try {
		let decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);

		let article = await ArticleData.getSingleArticle(articleId, true);
		if (article.author._id != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials",
			};
		}
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	try {
		let article = await ArticleData.getSingleArticle(articleId, true);
		return res.status(200).send(article);
		
	} catch (error) {
		console.log(error);
		return res.status(error.status).send(error.message);
	}
};

exports.patchArticle = async function (req, res) {
	let articleId = req.params.articleId;
	let patch = req.body;

	try {
		let decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);

		let article = await ArticleData.getSingleArticle(articleId, true);
		if (article.author._id != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials",
			};
		}
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
	
	try {
		let article = await ArticleData.updateArticle(articleId, patch);
		return res.status(200).send(article);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.deleteArticle = async function (req, res) {
	let articleId = req.params.articleId;

	try {
		let decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);

		let article = await ArticleData.getSingleArticle(articleId, true);

		if (article.author._id != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials",
			};
		}
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	try {
		let article = await ArticleData.deleteArticle(articleId);
		return res.status(203).send(article);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
