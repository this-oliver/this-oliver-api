// server and database
const Chai = require("chai");
const SuperTest = require("supertest");
const App = require("../../src/app");
const Database = require("../../src/database");

const Expect = Chai.expect;
const Request = SuperTest(App);

// data
const UserSchema = require("../../src/models/user");
const ArticleSchema = require("../../src/models/article");
const ArticleData = require("../../src/data/article");

// helpers
const Factory = require("../factory");
const TokenHelper = require("../../src/helpers/token");

describe("Articles in MiddleWare", function () {
	before(async function () {
		await Database.connect();
		await Database.drop();
	});
	
	after(async function () {
		await Database.drop();
		await Database.disconnect();
	});

	describe("[POST]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
			await ArticleSchema.deleteMany({});
		});

		it("post article with valid token should return article and 201 ", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);

			const requestArticle = Factory.models.createArticle(user._id);
			const requestToken = TokenHelper.getToken(user._id);

			const response = await Request.post("/api/articles")
				.set("Authorization", `bearer ${requestToken}`)
				.send(requestArticle)
				.expect(201);

			const article = response.body;
			Expect(article.title).to.equal(requestArticle.title);
		});

		it("post article with invalid article should return 400 ", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);

			const requestArticle = Factory.models.createArticle(user._id);
			requestArticle.title = null;
			requestArticle.author = null;

			const requestToken = TokenHelper.getToken(user._id);

			await Request.post("/api/articles")
				.set("Authorization", `bearer ${requestToken}`)
				.send(requestArticle)
				.expect(400);
		});

		it("post article with invalid token should return 401 ", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);

			const requestArticle = Factory.models.createArticle(user._id);
			const requestToken = "invalid_token";

			await Request.post("/api/articles")
				.set("Authorization", `bearer ${requestToken}`)
				.send(requestArticle)
				.expect(401);
		});
	});

	describe("[GET]", function () {
		let testUser, requestToken, privateArticle1, privateArticle2, publicArticle3;
		
		before(async function () {
			await Database.drop();

			const factoryUser = Factory.models.createUsers();
			testUser = await UserSchema.create(factoryUser);
			requestToken = TokenHelper.getToken(testUser._id);

			const factoryPrivateArticle1 = Factory.models.createArticle(
				testUser._id,
				false,
				"article1"
			);

			const factoryPrivateArticle2 = Factory.models.createArticle(
				testUser._id,
				false,
				"article2"
			);

			const factoryPublicArticle3 = Factory.models.createArticle(
				testUser._id,
				true,
				"article3"
			);

			privateArticle1 = await ArticleData.postArticle(
				factoryPrivateArticle1.author,
				factoryPrivateArticle1.title,
				factoryPrivateArticle1.content,
				[],
				factoryPrivateArticle1.publish
			);

			privateArticle2 = await ArticleData.postArticle(
				factoryPrivateArticle2.author,
				factoryPrivateArticle2.title,
				factoryPrivateArticle2.content,
				[],
				factoryPrivateArticle2.publish
			);

			publicArticle3 = await ArticleData.postArticle(
				factoryPublicArticle3.author,
				factoryPublicArticle3.title,
				factoryPublicArticle3.content,
				[],
				factoryPublicArticle3.publish
			);
		});

		after(async function () {
			await UserSchema.deleteMany({});
			await ArticleSchema.deleteMany({});
		});

		it("get single public article with valid id should return article and 200 ", async function () {

			const response = await Request.get(`/api/articles/${publicArticle3.id}`).expect(200);
			const resArticle1 = response.body;

			Expect(resArticle1.title).to.equal(publicArticle3.title);
		});
		
		it("get single public article with invalid id should return article and 404 ", async function () {
			const invalidArticleId = "invalid_article_id";
			await Request.get(`/api/articles/${invalidArticleId}`).expect(404);
		});

		it("get single private article with valid id and valid token should return article and 200 ", async function () {
			const response = await Request.get(`/api/admin/articles/${privateArticle1.id}`)
				.set("Authorization", `bearer ${requestToken}`)
				.expect(200);
			const resArticle1 = response.body;

			Expect(resArticle1.title).to.equal(privateArticle1.title);
		});
		
		it("get single private article with invalid id and valid token should return article and 404 ", async function () {
			const requestToken = TokenHelper.getToken(testUser.id);
			const invalidArticleId = "invalid_id";

			await Request.get(`/api/admin/articles/${invalidArticleId}`)
				.set("Authorization", `bearer ${requestToken}`)
				.expect(404);
		});

		it("get single private article with valid id and invalid token should return article and 401 ", async function () {
			const invalidRequestToken = "invalid_token";

			await Request.get(`/api/admin/articles/${privateArticle1.id}`)
				.set("Authorization", `bearer ${invalidRequestToken}`)
				.expect(401);
		});

		it("get public articles should return array of articles and 200 ", async function () {
			const response = await Request.get("/api/articles").expect(200);

			const articles = response.body;
			Expect(articles.length).to.equal(1);

			const resArticle1 = articles.find(
				(article) => article._id === publicArticle3.id
			);

			Expect(resArticle1.title).to.equal(publicArticle3.title);
		});

		it("get private articles with valid token should return array of articles and 200 ", async function () {
			const response = await Request.get("/api/admin/articles")
				.set("Authorization", `bearer ${requestToken}`)
				.expect(200);

			const articles = response.body;
			Expect(articles.length).to.equal(3);

			const resArticle1 = articles.find(
				(article) => article._id === privateArticle1.id
			);
			const resArticle2 = articles.find(
				(article) => article._id === privateArticle2.id
			);
			const resArticle3 = articles.find(
				(article) => article._id === publicArticle3.id
			);

			Expect(resArticle1.title).to.equal(privateArticle1.title);
			Expect(resArticle2.title).to.equal(privateArticle2.title);
			Expect(resArticle3.title).to.equal(publicArticle3.title);
		});

		it("get private articles with invalid token should return 401 ", async function () {
			const requestToken = "invalid_token";

			const response = await Request.get("/api/admin/articles")
				.set("Authorization", `bearer ${requestToken}`)
				.expect(401);

			Expect(response.body).to.be.empty;
		});
			
		it("get private articles without token should return 401 ", async function () {
			const response = await Request.get("/api/admin/articles")
				.expect(401);
				
			Expect(response.body).to.be.empty;
		});
	});

	describe("[PATCH]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
			await ArticleSchema.deleteMany({});
		});

		it("patching article with valid fields and valid token should return new article and 200 ", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);
			const requestToken = TokenHelper.getToken(user._id);

			const factoryArticle1 = Factory.models.createArticle(
				user._id,
				false,
				"article1"
			);

			const article1 = await ArticleData.postArticle(
				factoryArticle1.author,
				factoryArticle1.title,
				factoryArticle1.content,
				[],
				factoryArticle1.publish
			);

			const factoryArticle2 = Factory.models.createArticle(
				user._id,
				true,
				"article2"
			);

			const response = await Request.patch(`/api/articles/${article1.id}`)
				.set("Authorization", `bearer ${requestToken}`)
				.send(factoryArticle2)
				.expect(200);
			
			const resArticle = response.body;
			Expect(resArticle.title).to.equal(factoryArticle2.title);
			Expect(resArticle.publish).to.equal(factoryArticle2.publish);
		});

		it("incrementing an article's views should return article with views + 1 and 200 ", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);

			const factoryArticle1 = Factory.models.createArticle(
				user._id,
				false,
				"article1"
			);

			const article1 = await ArticleData.postArticle(
				factoryArticle1.author,
				factoryArticle1.title,
				factoryArticle1.content,
				[],
				factoryArticle1.publish
			);

			const response = await Request.patch(`/api/articles/${article1.id}/views`).expect(200);
			Expect(response.body.views).to.equal(1);

			const response2 = await Request.patch(`/api/articles/${article1.id}/views`).expect(200);
			Expect(response2.body.views).to.equal(2);
		});

		it("incrementing an article's likes should return article with likes + 1 and 200 ", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);

			const factoryArticle1 = Factory.models.createArticle(
				user._id,
				false,
				"article1"
			);

			const article1 = await ArticleData.postArticle(
				factoryArticle1.author,
				factoryArticle1.title,
				factoryArticle1.content,
				[],
				factoryArticle1.publish
			);

			const response = await Request.patch(
				`/api/articles/${article1.id}/likes`
			).expect(200);
			Expect(response.body.likes).to.equal(1);

			const response2 = await Request.patch(
				`/api/articles/${article1.id}/likes`
			).expect(200);
			Expect(response2.body.likes).to.equal(2);
		});

		it("incrementing an article's dislikes should return article with dislikes + 1 and 200 ", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);

			const factoryArticle1 = Factory.models.createArticle(
				user._id,
				false,
				"article1"
			);

			const article1 = await ArticleData.postArticle(
				factoryArticle1.author,
				factoryArticle1.title,
				factoryArticle1.content,
				[],
				factoryArticle1.publish
			);

			const response = await Request.patch(
				`/api/articles/${article1.id}/dislikes`
			).expect(200);
			Expect(response.body.dislikes).to.equal(1);

			const response2 = await Request.patch(
				`/api/articles/${article1.id}/dislikes`
			).expect(200);
			Expect(response2.body.dislikes).to.equal(2);
		});

		it("patching article with valid id and invalid token should 401 ", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);
			const invalidRequestToken = "invalid_request_token";

			const factoryArticle1 = Factory.models.createArticle(
				user._id,
				false,
				"article1"
			);

			const article1 = await ArticleData.postArticle(
				factoryArticle1.author,
				factoryArticle1.title,
				factoryArticle1.content,
				[],
				factoryArticle1.publish
			);

			const factoryArticle2 = Factory.models.createArticle(
				user._id,
				false,
				"article2"
			);

			await Request.patch(`/api/articles/${article1._id}`)
				.set("Authorization", `bearer ${invalidRequestToken}`)
				.send(factoryArticle2)
				.expect(401);
		});

		it("patching article with invalid fields and valid token should 400 ", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);
			const requestToken = TokenHelper.getToken(user._id);

			const factoryArticle1 = Factory.models.createArticle(
				user._id,
				false,
				"article1"
			);

			const article1 = await ArticleData.postArticle(
				factoryArticle1.author,
				factoryArticle1.title,
				factoryArticle1.content,
				[],
				factoryArticle1.publish
			);

			const factoryArticle2 = Factory.models.createArticle(
				user._id,
				2,
				null
			);

			const response = await Request.patch(`/api/articles/${article1.id}`)
				.set("Authorization", `bearer ${requestToken}`)
				.send(factoryArticle2)
				.expect(400);

			Expect(response.body).to.be.empty;
			Expect(response.text).to.not.be.empty;
		});

		it("patching article with invalid id and valid token should return 404 ", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);
			const requestToken = TokenHelper.getToken(user._id);

			const factoryArticle1 = Factory.models.createArticle(
				user._id,
				false,
				"article1"
			);

			await ArticleData.postArticle(
				factoryArticle1.author,
				factoryArticle1.title,
				factoryArticle1.content,
				[],
				factoryArticle1.publish
			);

			const invalidArticleId = "invalid_article_id";

			const factoryArticle2 = Factory.models.createArticle(
				user._id,
				false,
				"article2"
			);

			await Request.patch(`/api/articles/${invalidArticleId}`)
				.set("Authorization", `bearer ${requestToken}`)
				.send(factoryArticle2)
				.expect(404);
		});
	});

	describe("[DELETE]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
			await ArticleSchema.deleteMany({});
		});

		it("deleting article with valid id and valid token should return 203 ", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);
			const requestToken = TokenHelper.getToken(user._id);

			const factoryArticle1 = Factory.models.createArticle(
				user._id,
				false,
				"article1"
			);

			const article1 = await ArticleData.postArticle(
				factoryArticle1.author,
				factoryArticle1.title,
				factoryArticle1.content,
				[],
				factoryArticle1.publish
			);

			await Request.delete(`/api/articles/${article1.id}`)
				.set("Authorization", `bearer ${requestToken}`)
				.expect(203);
		});

		it("deleting article with invalid id and valid token should return 404 ", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);
			const requestToken = TokenHelper.getToken(user._id);

			const factoryArticle1 = Factory.models.createArticle(
				user._id,
				false,
				"article1"
			);

			await ArticleData.postArticle(
				factoryArticle1.author,
				factoryArticle1.title,
				factoryArticle1.content,
				[],
				factoryArticle1.publish
			);

			const invalidArticleId = "invalid_id";

			await Request.delete(`/api/articles/${invalidArticleId}`)
				.set("Authorization", `bearer ${requestToken}`)
				.expect(404);
		});

		it("deleting article with invalid id and invalid token should return 401 ", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);
			const invalidRequestToken = "invalid_request_token";

			const factoryArticle1 = Factory.models.createArticle(
				user._id,
				false,
				"article1"
			);

			const article1 = await ArticleData.postArticle(
				factoryArticle1.author,
				factoryArticle1.title,
				factoryArticle1.content,
				[],
				factoryArticle1.publish
			);

			await Request.delete(`/api/articles/${article1.id}`)
				.set("Authorization", `bearer ${invalidRequestToken}`)
				.expect(401);
		});
	});
});
