// data
const UserData = require("../data/user");
const ArticleData = require("../data/article");

exports.getUser = async function (req, res) {

	try {
		const user = await UserData.getUser();
		
		if (!user) {
			return res.status(404).send("user not found");
		} else {
			return res.status(200).send(user);
		}

	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.getUserArticles = async function (req, res) {

	try {
		const user = await UserData.getUser();
		const articles = await ArticleData.getUserArticles(user._id);
		return res.status(200).send(articles);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
