// prettier-ignore
// eslint-disable-next-line max-len

const Router = require("express").Router();
const BodyParser = require("body-parser");

const AuthController = require("./controllers/auth");
const UserController = require("./controllers/user");
const XpController = require("./controllers/xp");
const ArticleController = require("./controllers/article");

Router.use(BodyParser.urlencoded({ extended: false }));
Router.use(BodyParser.json());

const BaseRoute = "/api";

Router.get("/", (req, res) => {
	return res.status(200).send("welcome to olivermanzi's api");
});

Router.get(BaseRoute, (req, res) => {
	return res.status(200).send("root");
});

//* ROUTES

/* ==== Token Not Required (Public) ==== */
// auth
Router.post(`${BaseRoute}/auth/login`, AuthController.loginUser);
Router.post(`${BaseRoute}/auth/register`, AuthController.registerUser);
//users
Router.get(`${BaseRoute}/users`, UserController.getAllUsers);
Router.get(`${BaseRoute}/users/:userId`, UserController.getSingleUser);
Router.get(`${BaseRoute}/users/:userId/articles`, UserController.getUserArticles);
// articles
Router.get(`${BaseRoute}/articles`, ArticleController.getAllArticles);
Router.get(`${BaseRoute}/articles/:articleId`, ArticleController.getSingleArticle);

/* ==== Token Required (Private) ==== */
// auth
Router.patch(`${BaseRoute}/auth/password`, AuthController.resetPassword);
// user
Router.patch(`${BaseRoute}/users/:userId`, UserController.patchUser);
Router.post(`${BaseRoute}/users/:userId/experiences`, XpController.postExperience);
Router.post(`${BaseRoute}/users/:userId/articles`, ArticleController.postArticle);
Router.get(`${BaseRoute}/users/:userId/secret-articles`, UserController.getSecretUserArticles);
// experiences
Router.patch(`${BaseRoute}/experiences/:xpId`, XpController.patchExperience);
Router.delete(`${BaseRoute}/experiences/:xpId`, XpController.deleteExperience);
// articles
Router.patch(`${BaseRoute}/articles/:articleId`, ArticleController.patchArticle);
Router.delete(`${BaseRoute}/articles/:articleId`, ArticleController.deleteArticle);

module.exports = Router;
