// mongo
const ArticleSchema = require("../models/article");
const UserData = require("./user");
const TagData = require("./tag");

exports.postArticle = async (userId, title, content, tags, publish) => {
	let user = null;

	// get user
	try {
		user = await UserData.getSingleUser(userId);
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message, 
		};
	}

	// handle tag
	let tagList = [];

	try {
		tagList = await TagData.cleanTags(tags);
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message, 
		};
	}

	// create article
	try {
		const article = await ArticleSchema.create(new ArticleSchema({
			title: title,
			author: user._id,
			content: content,
			tags: tagList,
			publish: publish, 
		}));

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

exports.getAllArticles = async (showSecrets = false) => {
	try {
		const articles = showSecrets ?			await ArticleSchema.find()
			.populate("tags")
			.populate({
				path: "author",
				select: {
					_id: 1,
					name: 1,
					email: 1, 
				}, 
			})
			.exec() :			await ArticleSchema.find({ publish: true })
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

		return articles;
	} catch (error) {
		throw {
			status: 400,
			message: error.message || error, 
		};
	}
};

exports.getSingleArticle = async (id, showSecrets = false) => {
	if (!id) {
		throw {
			status: 400,
			message: "missing id", 
		};
	}

	try {
		let article;

		if(showSecrets){
			article = await ArticleSchema.findById(id)
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
		}else {
			article = await ArticleSchema.findOne({ _id: id })
				.where("publish")
				.equals(true)
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
		}

		if (!article) {
			throw {
				status: 404,
				message: `article with id ${id} does not exist`, 
			};
		}

		return article;
	} catch (error) {
		if(error.kind === "ObjectId"){
			throw {
				status: 404,
				message: `article with id ${id} does not exist`,
			};
		}

		throw {
			status: error.status || 400,
			message: error.message || error, 
		};
	}
};

exports.getUserArticles = async (id, showSecrets = false) => {
	if (!id) {
		throw {
			status: 400,
			message: "missing id", 
		};
	}

	try {
		let articles;

		if(showSecrets){
			articles = await ArticleSchema.find({ author: id })
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
		}else {
			articles = await ArticleSchema.find({ author: id, publish: true })
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
		}

		return articles;
	} catch (error) {
		throw {
			status: 400,
			message: error.message || error, 
		};
	}
};

exports.updateArticle = async (id, patch) => {
	let article = null;

	try {
		article = await this.getSingleArticle(id, true);
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message, 
		};
	}

	try {
		article.title = patch.title || article.title;
		article.author = patch.author || article.author;
		article.content = patch.content || article.content;
		article.publish = patch.publish || article.publish;

		if (patch.tags) {
			article.tags = await TagData.cleanTags(patch.tags);
		}

		article = await article.save();

		return article;
	} catch (error) {
		throw {
			status: 400,
			message: error.message, 
		};
	}
};

exports.incrementArticleViews = async (id) => {
	let article = null;

	try {
		article = await this.getSingleArticle(id, true);
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message,
		};
	}

	try {
		article.views = article.views + 1;
		
		article = await article.save();

		return article;
	} catch (error) {
		throw {
			status: 400,
			message: error.message,
		};
	}
	
};

exports.incrementArticleLikes = async (id) => {
	let article = null;

	try {
		article = await this.getSingleArticle(id, true);
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message,
		};
	}

	try {
		article.likes = article.likes + 1;
		
		article = await article.save();

		return article;
	} catch (error) {
		throw {
			status: 400,
			message: error.message,
		};
	}
	
};

exports.incrementArticleDislikes = async (id) => {
	let article = null;

	try {
		article = await this.getSingleArticle(id, true);
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message,
		};
	}

	try {
		article.dislikes = article.dislikes + 1;
		
		article = await article.save();

		return article;
	} catch (error) {
		throw {
			status: 400,
			message: error.message,
		};
	}
	
};

exports.deleteArticle = async (id) => {
	try {
		let xp = await this.getSingleArticle(id, true);
		xp = await xp.remove();

		return `${xp.title} with id ${id} deleted`;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error, 
		};
	}
};
