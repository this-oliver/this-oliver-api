const ArticleData = require("../data/article");
const TagData = require("../data/tag");

const TokenHelper = require("../helpers/token");

exports.postArticle = async function (req, res, next) {
	let userId = req.params.userId;
	let data = req.body;

	try {
		let article = await ArticleData.postArticle(
			userId,
			data.title,
			data.content,
			data.tags
		);
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

exports.getAllTags = async function (req, res) {
	try {
		let tags = await TagData.getAllTags();
		return res.status(200).send(tags);
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

exports.patchArticle = async function (req, res) {
	let articleId = req.params.articleId;
	let patch = req.body;

	try {
		let decoded = TokenHelper.verifyToken(
			req.headers.authorization.split(" ")[1]
		);

		let article = await ArticleData.getSingleArticle(articleId);

		if (article.author != decoded.data) {
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
		let decoded = TokenHelper.verifyToken(
			req.headers.authorization.split(" ")[1]
		);

		let article = await ArticleData.getSingleArticle(articleId);

		if (article.author != decoded.data) {
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
