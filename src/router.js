// prettier-ignore
// eslint-disable-next-line max-len

const Router = require("express").Router();

const AuthController = require("./controllers/auth");
const AdminController = require("./controllers/admin");
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
Router.post("/api/auth/login", AuthController.login);
Router.post("/api/auth/register", AuthController.register); // note: only one user allowed in this api :P

// admin
/* Token Required */ Router.get("/api/admin", AdminController.getAdmin);
/* Token Required */ Router.get("/api/admin/articles", AdminController.getArticles);
/* Token Required */ Router.get("/api/admin/articles/:id", AdminController.getSingleArticle);
/* Token Required */ Router.patch("/api/admin", AdminController.patchAdmin);
/* Token Required */ Router.patch("/api/auth/password", AdminController.resetPassword);

// user
Router.get("/api/user", UserController.getUser);
Router.get("/api/user/articles", UserController.getUserArticles);

// experiences
/* Token Required */ Router.post("/api/experiences", XpController.postExperience);
/* Token Required */ Router.patch("/api/experiences/:id", XpController.patchExperience);
/* Token Required */ Router.delete("/api/experiences/:id", XpController.deleteExperience);

// articles
Router.get("/api/articles", ArticleController.getAllArticles);
Router.get("/api/articles/:id", ArticleController.getSingleArticle);
/* Token Required */ Router.post("/api/articles", ArticleController.postArticle);
/* Token Required */ Router.patch("/api/articles/:id", ArticleController.patchArticle);
/* Token Required */ Router.delete("/api/articles/:id", ArticleController.deleteArticle);

module.exports = Router;

