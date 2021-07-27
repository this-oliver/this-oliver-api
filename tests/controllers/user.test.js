// server and database
const App = require("../../src/app");
const Database = require("../../src/database");

// framework
const Chai = require("chai");
const Expect = Chai.expect;
const supertest = require("supertest");
const Request = supertest(App);

// data
const UserSchema = require("../../src/models/user");
const ArticleData = require("../../src/data/article");

// helpers
const Factory = require("../factory");

describe("User in MiddleWare", function () {
	before(async function () {
		await Database.connect();
	});

	after(async function () {
		await UserSchema.deleteMany({});
		await Database.disconnect();
	});

	describe("[GET]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});

		it("get user should return 200 and user", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);

			const response = await Request.get(`/api/user`).expect(200);

			const body = response.body;
			Expect(body.name).to.equal(user.name);
			Expect(body.email).to.equal(user.email);
		});

		it("get user should not return articles that haven't been published", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);

			const factoryPublishedArticle = Factory.models.createArticle(
				user._id,
				true,
				"publsihed article"
			);
			const factorySecretArticle = Factory.models.createArticle(
				user._id,
				false,
				"not publsihed article"
			);

			try {
				await ArticleData.postArticle(
					factoryPublishedArticle.author,
					factoryPublishedArticle.title,
					factoryPublishedArticle.content,
					null,
					factoryPublishedArticle.publish
				);
				
				await ArticleData.postArticle(
					factorySecretArticle.author,
					factorySecretArticle.title,
					factorySecretArticle.content,
					null,
					factorySecretArticle.publish
				);
			} catch (error) {
				console.log({ error });
			}

			const response = await Request.get(`/api/user`).expect(200);

			const body = response.body;
			Expect(body.name).to.equal(user.name);
			Expect(body.email).to.equal(user.email);
			Expect(body.articles.length).to.equal(1);
		});
	});
});
