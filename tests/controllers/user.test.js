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

// helpers
const TokenHelper = require("../../src/helpers/token");
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
			const token = TokenHelper.getToken(user._id);
			
			const response = await Request
				.get(`/api/user`)
				.set("Authorization", `bearer ${token}`)
				.expect(200);
			
			const body = response.body;
			Expect(body.name).to.equal(user.name);
			Expect(body.email).to.equal(user.email);
		});
	});

	describe("[PATCH]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});

		it("patch valid user id should return 200 and updated user", async function () {
			const factoryUsers = Factory.models.createUsers(2);

			const user1 = await UserSchema.create(factoryUsers[0]);
			const token = TokenHelper.getToken(user1._id);

			const user2 = factoryUsers[1];
			const patch = { name: user2.name, email: user2.email };

			const response = await Request
				.patch(`/api/user/${user1._id}`)
				.set("Authorization", `bearer ${token}`)
				.send(patch)
				.expect(200);

			const body = response.body;
			Expect(body.name).to.equal(patch.name);
			Expect(body.email).to.equal(patch.email);
		});

		it("patch user with invalid token should return 401", async function () {
			const factoryObjectId = Factory.mongo.createObjectId();
			const patch = {};
			await Request
				.patch(`/api/user/${factoryObjectId}`)
				.set("Authorization", `bearer ${0}`)
				.send(patch)
				.expect(401);
		});
	});
});
