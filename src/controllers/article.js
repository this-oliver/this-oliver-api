const ArticleData = require("../data/article");
const TagData = require("../data/tag");
const UserData = require("../data/user");
const AuthHelper = require("../helpers/auth");
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
		const articles = await ArticleData.indexArticles();
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

		user = await UserData.getOliver();

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
		const articles = await ArticleData.indexArticles(true);
		return res.status(200).send(articles);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.getArticle = async function (req, res) {
	const articleId = req.params.id;

	try {
		const article = await ArticleData.getArticle(articleId);
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

		const article = await ArticleData.getArticle(articleId, true);
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
		const article = await ArticleData.getArticle(articleId, true);
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

		const article = await ArticleData.getArticle(articleId, true);
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

		const article = await ArticleData.getArticle(articleId, true);

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

/* tags */

exports.indexArticlesByTag = async function (req, res) {
	try {
		const tagId = req.params.id;
		const articles = await ArticleData.indexArticlesByTag(tagId);
		return res.status(200).send(articles);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.indexSecretArticlesByTag = async function (req, res) {
	const authenticated = await AuthHelper.authenticateRequest(req);
	if(authenticated === false) return res.status(401).send();
	
	try {
		const tagId = req.params.id;
		const articles = await ArticleData.indexArticlesByTag(tagId);
		return res.status(200).send(articles);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.indexArticlesTags = async function (req, res) {
	try {
		const articles = await TagData.indexTags();
		return res.status(200).send(articles);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.indexSecretArticlesTags = async function (req, res) {
	const authenticated = await AuthHelper.authenticateRequest(req);
	if(authenticated === false) return res.status(401).send();
	
	try {
		const articles = await TagData.indexTags();
		return res.status(200).send(articles);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
