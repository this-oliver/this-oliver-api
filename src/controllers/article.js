const ArticleData = require("../data/article");
const UserData = require("../data/user");
const TokenHelper = require("../helpers/token");

exports.postArticle = async function (req, res) {
	const data = req.body;
	let userId = null;

	try {
		const decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);
		userId = decoded.data;
	} catch (error) {
		return res.status(error.status || 401).send(error.message);
	}

	try {
		const article = await ArticleData.postArticle(userId, data.title, data.content, data.tags, data.publish);
		return res.status(201).send(article);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.indexArticles = async function (req, res) {
	try {
		const articles = await ArticleData.getAllArticles();
		return res.status(200).send(articles);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.indexSecretArticles = async function (req, res) {
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

exports.getArticle = async function (req, res) {
	const articleId = req.params.id;

	try {
		const article = await ArticleData.getSingleArticle(articleId);
		return res.status(200).send(article);
		
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.getSecretArticle = async function (req, res) {
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

exports.patchArticle = async function (req, res) {
	const articleId = req.params.id;
	const patch = req.body;

	try {
		const decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);

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
		const article = await ArticleData.updateArticle(articleId, patch);
		return res.status(200).send(article);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.incrementArticleViews = async function (req, res) {
	const articleId = req.params.id;
	
	try {
		const article = await ArticleData.incrementArticleViews(articleId);
		return res.status(200).send(article);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.incrementArticleLikes = async function (req, res) {
	const articleId = req.params.id;
	
	try {
		const article = await ArticleData.incrementArticleLikes(articleId);
		return res.status(200).send(article);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.incrementArticleDislikes = async function (req, res) {
	const articleId = req.params.id;
	
	try {
		const article = await ArticleData.incrementArticleDislikes(articleId);
		return res.status(200).send(article);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.deleteArticle = async function (req, res) {
	const articleId = req.params.id;

	try {
		const decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);

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
		const article = await ArticleData.deleteArticle(articleId);
		return res.status(203).send(article);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
