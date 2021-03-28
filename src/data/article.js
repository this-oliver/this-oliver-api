// mongo
const ArticleSchema = require("../models/article");
const UserData = require("./user");
const TagData = require("./tag");

exports.postArticle = async (userId, title, content, tags) => {
	let user = null;

	// get user
	try {
		user = await UserData.getSingleUser(userId);
	} catch (error) {
		throw {
			status: error.status,
			message: error.message,
		};
	}

	// handle tag
	let tagList = [];

	try {
		tagList = await TagData.cleanTags(tags);
	} catch (error) {
		throw {
			status: error.status,
			message: error.message,
		};
	}

	// create article
	try {
		let article = await ArticleSchema.create(
			new ArticleSchema({
				title: title,
				author: user._id,
				content: content,
				tags: tagList,
			})
		);

		user.articles.push(article._id);
		await user.save();

		return article;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error,
		};
	}
};

exports.getAllArticles = async () => {
	try {
		return await ArticleSchema.find()
			.populate("tags")
			.populate({
				path: "author",
				select: {
					_id: 1,
					name: 1,
					email: 1,
				},
			})
			.exec();
	} catch (error) {
		throw {
			status: 400,
			message: error.message || error,
		};
	}
};

exports.getUserArticles = async (id) => {
	if (!id) {
		throw {
			status: 400,
			message: "missing id",
		};
	}

	try {
		return await ArticleSchema.find({ author: id })
			.populate("tags")
			.populate({
				path: "author",
				select: {
					_id: 1,
					name: 1,
					email: 1,
				},
			})
			.exec();
	} catch (error) {
		throw {
			status: 400,
			message: error.message || error,
		};
	}
};

exports.getSingleArticle = async (id) => {
	if (!id) {
		throw {
			status: 400,
			message: "missing id",
		};
	}

	try {
		let article = await ArticleSchema.findById(id)
			.populate("tags")
			.populate({
				path: "author",
				select: {
					_id: 1,
					name: 1,
					email: 1,
				},
			})
			.exec();

		if (!article) {
			throw {
				status: 404,
				message: `article with id ${id} does not exist`,
			};
		}

		return article;
	} catch (error) {
		throw {
			status: error.status,
			message: error.message || error,
		};
	}
};

exports.updateArticle = async (id, patch) => {
	let article = null;

	try {
		article = await this.getSingleArticle(id);
	} catch (error) {
		throw {
			status: error.status,
			message: error.message,
		};
	}

	try {
		article.title = patch.title || article.title;
		article.author = patch.author || article.author;
		article.content = patch.content || article.content;

		if (patch.tags) {
			article.tags = await TagData.cleanTags(patch.tags);
		}

		article = await article.save();
		return xp;
	} catch (error) {
		throw {
			status: 400,
			message: error,
		};
	}
};

exports.deleteArticle = async (id) => {
	try {
		let xp = await this.getSingleArticle(id);
		xp = await xp.remove();

		return `${xp.title} with id ${id} deleted`;
	} catch (error) {
		throw {
			status: error.status,
			message: error.message || error,
		};
	}
};
