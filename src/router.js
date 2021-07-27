// prettier-ignore
// eslint-disable-next-line max-len

const Router = require("express").Router();

const AuthController = require("./controllers/auth");
const UserController = require("./controllers/user");
const XpController = require("./controllers/xp");
const ArticleController = require("./controllers/article");

const BaseRoute = "/api";

Router.get("/", (req, res) => {
	return res.status(200).send("welcome to olivermanzi's api");
});

Router.get(BaseRoute, (req, res) => {
	return res.status(200).send("root");
});

// auth
Router.post(`${BaseRoute}/auth/login`, AuthController.loginUser);
Router.post(`${BaseRoute}/auth/register`, AuthController.registerUser);
/* Token Required */ Router.patch(`${BaseRoute}/auth/password`, AuthController.resetPassword);

// users
Router.get(`${BaseRoute}/users`, UserController.getAllUsers);
Router.get(`${BaseRoute}/users/:userId`, UserController.getSingleUser);
Router.get(`${BaseRoute}/users/:userId/articles`, UserController.getUserArticles);
/* Token Required */ Router.patch(`${BaseRoute}/users/:userId`, UserController.patchUser);
/* Token Required */ Router.get(`${BaseRoute}/users/:userId/articles/secret`, UserController.getSecretUserArticles);

// experiences
/* Token Required */ Router.post(`${BaseRoute}/experiences`, XpController.postExperience);
/* Token Required */ Router.patch(`${BaseRoute}/experiences/:xpId`, XpController.patchExperience);
/* Token Required */ Router.delete(`${BaseRoute}/experiences/:xpId`, XpController.deleteExperience);

// articles
Router.get(`${BaseRoute}/articles`, ArticleController.getAllArticles);
Router.get(`${BaseRoute}/articles/:articleId`, ArticleController.getSingleArticle);
/* Token Required */ Router.post(`${BaseRoute}/articles`, ArticleController.postArticle);
/* Token Required */ Router.get(`${BaseRoute}/articles/:articleId/secret`, ArticleController.getSecretSingleArticle);
/* Token Required */ Router.patch(`${BaseRoute}/articles/:articleId`, ArticleController.patchArticle);
/* Token Required */ Router.delete(`${BaseRoute}/articles/:articleId`, ArticleController.deleteArticle);

module.exports = Router;
