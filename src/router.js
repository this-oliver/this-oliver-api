const Router = require("express").Router();
const BodyParser = require("body-parser");

const AuthController = require("./controllers/auth");
const UserController = require("./controllers/user");
const ExperienceController = require("./controllers/xp");
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

/* ==== Authentication ==== */
Router.post(`${BaseRoute}/auth/login`, AuthController.loginUser);
Router.post(`${BaseRoute}/auth/register`, UserController.postUser);
Router.patch(`${BaseRoute}/auth/password`, AuthController.resetPassword); // token

/*  ==== User  ====  */
Router.post(`${BaseRoute}/users`, UserController.postUser);
Router.get(`${BaseRoute}/users/:id`, UserController.getSingleUser);
Router.get(`${BaseRoute}/users`, UserController.getAllUsers);
Router.patch(`${BaseRoute}/users/:id`, UserController.patchUser); // token
Router.post(
	`${BaseRoute}/users/:userId/experiences`,
	ExperienceController.postExperience
); // token
Router.post(
	`${BaseRoute}/users/:userId/articles`,
	ArticleController.postArticle
); // token

/*  ==== Experiences ==== */
Router.get(`${BaseRoute}/experiences`, ExperienceController.getAllExperiences);
Router.get(
	`${BaseRoute}/experiences/:xpId`,
	ExperienceController.getSingleExperience
);
Router.patch(
	`${BaseRoute}/experiences/:xpId`,
	ExperienceController.patchExperience
); // token
Router.delete(
	`${BaseRoute}/experiences/:xpId`,
	ExperienceController.deleteExperience
); // token

/* ==== Articles ==== */
Router.get(`${BaseRoute}/articles`, ArticleController.getAllArticles);
Router.get(
	`${BaseRoute}/articles/:articleId`,
	ArticleController.getSingleArticle
);
Router.patch(
	`${BaseRoute}/articles/:articleId`,
	ArticleController.patchArticle
); // token
Router.delete(
	`${BaseRoute}/articles/:articleId`,
	ArticleController.deleteArticle
); // token

module.exports = Router;
