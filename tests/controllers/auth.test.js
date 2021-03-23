const app = require("../../src/app");
const DB = require("../../src/database");

const chai = require("chai");
const expect = chai.expect;
const supertest = require("supertest");
const request = supertest(app);

// data
const UserSchema = require("../../src/models/user");

// helpers
const Factory = require("../factory");
const JsonConverter = require("../json");

describe("Authentication in Middleware", function () {
	before(async function () {
		await DB.connect();
	});

	// disconnect the db after testing everything
	after(async function () {
		await DB.disconnect();
	});

	// delete all users before each test
	beforeEach(async function () {
		await UserSchema.deleteMany({});
	});

	describe("[USER LOGIN]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});

		it("login valid user returns 200", async function () {
			let factoryUser = Factory.models.createUsers();
			await UserSchema.create(factoryUser);

			let res = await request
				.post("/api/auth/login")
				.set("Accept", "application/json")
				.send({
					email: factoryUser.email,
					password: factoryUser.password,
				})
				.expect(200);
			let body = JsonConverter.parseTextIntoJson(res.text);
			expect(body.token).to.exist;
			expect(body.user).to.exist;
		});

		it("login with invalid email returns 404", async function () {
			let factoryUser = Factory.models.createUsers();

			await UserSchema.create(factoryUser);
			await request
				.post("/api/auth/login")
				.send({
					email: "invalid@mail.com",
					password: factoryUser.password,
				})
				.expect(404);
		});

		it("login with invalid password returns 404", async function () {
			let factoryUser = Factory.models.createUsers();

			await UserSchema.create(factoryUser);
			await request
				.post("/api/auth/login")
				.send({
					email: factoryUser.email,
					password: "invalid_password",
				})
				.expect(404);
		});

		it("login with invalid email and password returns 404", async function () {
			let factoryUser = Factory.models.createUsers();

			await UserSchema.create(factoryUser);
			await request
				.post("/api/auth/login")
				.send({
					email: "invalid@mail.com",
					password: "invalid_password",
				})
				.expect(404);
		});
	});
});
