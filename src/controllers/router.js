const Router = require("express").Router();
const BodyParser = require("body-parser");

const Auth = require("./auth");
const User = require("./user");
const Experience = require("./experience");

Router.use(BodyParser.urlencoded({ extended: false }));
Router.use(BodyParser.json());

const BaseRoute = "/api";

Router.get("/", (req, res) => {
	return res.status(200).send("welcome to olivermanzi's api");
});

Router.get(BaseRoute, (req, res) => {
	return res.status(200).send("root");
});

/* ROUTES */
//* Authentication
Router.post(BaseRoute + "/auth/login", Auth.loginUser);
Router.post(BaseRoute + "/auth/register", User.postUser);
Router.patch(BaseRoute + "/auth/password", Auth.resetPassword); // token

//* Oliver - it's all about me baby 🤠
Router.post(BaseRoute + "/users", User.postUser);
Router.get(BaseRoute + "/users/:id", User.getSingleUser);
Router.get(BaseRoute + "/users", User.getAllUsers);
Router.patch(BaseRoute + "/users/:id", User.patchUser); // token
Router.post(
	BaseRoute + "/users/:userId/experiences",
	Experience.postExperience
); // token

//* Experiences
Router.get(BaseRoute + "/experiences", Experience.getAllExperience);
Router.get(BaseRoute + "/experiences/:xpId", Experience.getSingleExperience);
Router.patch(BaseRoute + "/experiences/:xpId", Experience.patchExperience); // token
Router.delete(BaseRoute + "/experiences/:xpId", Experience.deleteExperience); // token

module.exports = Router;
