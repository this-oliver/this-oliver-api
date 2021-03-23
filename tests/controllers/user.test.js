// server and database
const App = require("../../src/app");
const DB = require("../../src/database");

// framework
const chai = require("chai");
const expect = chai.expect;
const supertest = require("supertest");
const request = supertest(App);

// data
const UserSchema = require("../../src/models/user");

// helpers
const TokenHelper = require("../../src/helpers/token");
const Factory = require("../factory");
const JsonConverter = require("../json");

describe("User in MiddleWare", function () {
	before(async function () {
		await DB.connect();
	});

	after(async function () {
		await UserSchema.deleteMany({});
		await DB.disconnect();
	});

	describe("[POST]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});

		it("post valid user should return 201 and user", async function () {
			let factoryUser = Factory.models.createUsers();
			let res = await request.post("/api/users").send(factoryUser).expect(201);
			let user = JsonConverter.parseTextIntoJson(res.text);
			expect(user.name).to.equal(factoryUser.name);
		});

		it("post invalid user fields should return 400", async function () {
			await request
				.post("/api/users")
				.send({ email: "", name: "", password: "" })
				.expect(400);
		});

		it("post user with existing email should return 400", async function () {
			let factoryUser = Factory.models.createUsers();
			await UserSchema.create(factoryUser);

			await request
				.post("/api/users")
				.send({
					email: factoryUser.email,
					name: "bob Test",
					password: "bob pa55word",
				})
				.expect(400);
		});
	});

	describe("[GET]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});

		it("get user by id should return 200 and user", async function () {
			let factoryUser = Factory.models.createUsers();
			let user = await UserSchema.create(factoryUser);
			let token = TokenHelper.getToken(user._id);
			let response = await request
				.get("/api/users/" + user._id)
				.set("Authorization", `bearer ${token}`)
				.expect(200);
			let body = JsonConverter.parseTextIntoJson(response.text);
			expect(body.name).to.equal(user.name);
			expect(body.email).to.equal(user.email);
		});

		it("get all users should return 200 and array of users", async function () {
			let factoryUsers = Factory.models.createUsers(5);
			let users = await UserSchema.create(factoryUsers);
			let token = TokenHelper.getToken(users[0]._id);
			let response = await request
				.get("/api/users/")
				.set("Authorization", `bearer ${token}`)
				.expect(200);
			let body = JsonConverter.parseTextIntoJson(response.text);
			expect(body.length).to.equal(5);
		});
	});

	describe("[PATCH]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});

		it("patch valid user id should return 200 and updated user", async function () {
			let factoryUsers = Factory.models.createUsers(2);

			let user1 = await UserSchema.create(factoryUsers[0]);
			let token = TokenHelper.getToken(user1._id);

			let user2 = factoryUsers[1];
			let patch = { name: user2.name, email: user2.email };

			let response = await request
				.patch("/api/users/" + user1._id)
				.set("Authorization", `bearer ${token}`)
				.send(patch)
				.expect(200);

			let body = JsonConverter.parseTextIntoJson(response.text);
			expect(body.name).to.equal(patch.name);
			expect(body.email).to.equal(patch.email);
		});

		it("patch user with invalid token should return 401", async function () {
			let factoryObjectId = Factory.mongo.createObjectId();
			let patch = {};
			await request
				.patch("/api/users/" + factoryObjectId)
				.set("Authorization", `bearer ${0}`)
				.send(patch)
				.expect(401);
		});
	});

	describe("[DELETE]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});

		it("delete valid user id should return 200", async function () {
			let factoryUser = Factory.models.createUsers();
			let user = await UserSchema.create(factoryUser);
			let token = TokenHelper.getToken(user._id);
			expect(await UserSchema.countDocuments({})).to.equal(1);

			await request
				.delete("/api/users/" + user._id)
				.set("Authorization", `bearer ${token}`)
				.expect(200);
		});

		it("delete invalid user id should return 401", async function () {
			let factoryUser = Factory.models.createUsers();
			let user = await UserSchema.create(factoryUser);
			let token = TokenHelper.getToken(user._id);
			let invalidUserId = "x";
			await request
				.delete("/api/users/" + invalidUserId)
				.set("Authorization", `bearer ${token}`)
				.expect(401);
		});
	});
});
