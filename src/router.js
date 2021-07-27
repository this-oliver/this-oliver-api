// prettier-ignore
// eslint-disable-next-line max-len

const Router = require("express").Router();

const AuthController = require("./controllers/auth");
const UserController = require("./controllers/user");
const XpController = require("./controllers/xp");
const ArticleController = require("./controllers/article");

Router.get("/", (req, res) => {
	return res.status(200).send("welcome to olivermanzi's api");
});

Router.get("/api", (req, res) => {
	return res.status(200).send("root");
});

// auth
Router.post("/api/auth/login", AuthController.loginUser);
Router.post("/api/auth/register", AuthController.registerUser); // note: only one user allowed in this api :P
/* Token Required */ Router.patch("/api/auth/password", AuthController.resetPassword);

// users
Router.get("/api/user", UserController.getUser);
Router.get("/api/user/:userId/articles", UserController.getUserArticles);
/* Token Required */ Router.patch("/api/user/:userId", UserController.patchUser);
/* Token Required */ Router.get("/api/user/:userId/articles/secret", UserController.getSecretUserArticles);

// experiences
/* Token Required */ Router.post("/api/experiences", XpController.postExperience);
/* Token Required */ Router.patch("/api/experiences/:xpId", XpController.patchExperience);
/* Token Required */ Router.delete("/api/experiences/:xpId", XpController.deleteExperience);

// articles
Router.get("/api/articles", ArticleController.getAllArticles);
Router.get("/api/articles/:articleId", ArticleController.getSingleArticle);
/* Token Required */ Router.post("/api/articles", ArticleController.postArticle);
/* Token Required */ Router.get("/api/articles/:articleId/secret", ArticleController.getSecretSingleArticle);
/* Token Required */ Router.patch("/api/articles/:articleId", ArticleController.patchArticle);
/* Token Required */ Router.delete("/api/articles/:articleId", ArticleController.deleteArticle);

module.exports = Router;
