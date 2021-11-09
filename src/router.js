// prettier-ignore
// eslint-disable-next-line max-len

const Router = require("express").Router();

const AuthController = require("./controllers/auth");
const UserController = require("./controllers/user");
const ArticleController = require("./controllers/article");
const ExperienceController = require("./controllers/experience");

Router.get("/", (req, res) => {
	return res.status(200).send("welcome to olivermanzi's api");
});

Router.get("/api", (req, res) => {
	return res.status(200).send("root");
});

// auth
Router.post("/api/auth/login", AuthController.login);
Router.post("/api/auth/register", AuthController.register); // note: only one user allowed in this api :P
/* Token Required */ Router.patch("/api/auth/password", AuthController.resetPassword);

// admin
/* Token Required */ Router.get("/api/admin", UserController.getAdmin);
/* Token Required */ Router.get("/api/admin/articles", ArticleController.indexSecretArticles);
/* Token Required */ Router.get("/api/admin/articles/:id", ArticleController.getSecretArticle);
/* Token Required */ Router.patch("/api/admin", UserController.patch);

// user
Router.get("/api/user", UserController.getOliver);
Router.patch("/api/user/visits", UserController.incrementVisits);

// experiences
/* Token Required */ Router.post("/api/experiences", ExperienceController.postExperience);
/* Token Required */ Router.patch("/api/experiences/:id", ExperienceController.patchExperience);
/* Token Required */ Router.delete("/api/experiences/:id", ExperienceController.deleteExperience);

// articles
Router.get("/api/articles", ArticleController.indexArticles);
Router.get("/api/articles/:id", ArticleController.getArticle);
Router.patch("/api/articles/:id/views", ArticleController.incrementArticleViews);
Router.patch("/api/articles/:id/likes", ArticleController.incrementArticleLikes);
Router.patch("/api/articles/:id/dislikes", ArticleController.incrementArticleDislikes);
/* Token Required */ Router.post("/api/articles", ArticleController.postArticle);
/* Token Required */ Router.patch("/api/articles/:id", ArticleController.patchArticle);
/* Token Required */ Router.delete("/api/articles/:id", ArticleController.deleteArticle);


// wildcard
Router.get("/*", (req, res) => {
	return res.status(400).send(`[*] the resource '${req.url}' does not exists`);
});

module.exports = Router;
