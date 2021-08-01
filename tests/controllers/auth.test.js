const App = require("../../src/app");
const Database = require("../../src/database");
const Chai = require("chai");
const supertest = require("supertest");

const Expect = Chai.expect;
const Request = supertest(App);

// data
const UserSchema = require("../../src/models/user");

// helpers
const Factory = require("../factory");

describe("Authentication in Middleware", function () {
	before(async function () {
		await Database.connect();
	});

	// disconnect the db after testing everything
	after(async function () {
		await Database.drop();
		await Database.disconnect();
	});

	// delete all users before each test
	beforeEach(async function () {
		await UserSchema.deleteMany({});
	});

	describe("[LOGIN]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});

		it("login valid user returns 200", async function () {
			const factoryUser = Factory.models.createUsers();
			await UserSchema.create(factoryUser);

			const response = await Request
				.post("/api/auth/login")
				.set("Accept", "application/json")
				.send({
					email: factoryUser.email,
					password: factoryUser.password,
				})
				.expect(200);
			const body = response.body;
			Expect(body.token).to.exist;
			Expect(body.user).to.exist;
		});

		it("login with invalid email returns 404", async function () {
			const factoryUser = Factory.models.createUsers();

			await UserSchema.create(factoryUser);
			await Request
				.post("/api/auth/login")
				.send({
					email: "invalid@mail.com",
					password: factoryUser.password,
				})
				.expect(404);
		});

		it("login with invalid password returns 404", async function () {
			const factoryUser = Factory.models.createUsers();

			await UserSchema.create(factoryUser);
			await Request
				.post("/api/auth/login")
				.send({
					email: factoryUser.email,
					password: "invalid_password",
				})
				.expect(404);
		});

		it("login with invalid email and password returns 404", async function () {
			const factoryUser = Factory.models.createUsers();

			await UserSchema.create(factoryUser);
			await Request
				.post("/api/auth/login")
				.send({
					email: "invalid@mail.com",
					password: "invalid_password",
				})
				.expect(404);
		});
	});

	describe("[Register]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});

		it("post valid user should return 201 and user", async function () {
			const factoryUser = Factory.models.createUsers();
			const response = await Request.post("/api/auth/register")
				.send(factoryUser)
				.expect(201);
			const user = response.body;
			Expect(user.name).to.equal(factoryUser.name);
		});

		it("post invalid user fields should return 400", async function () {
			await Request.post("/api/auth/register")
				.send({ email: "", name: "", password: "" })
				.expect(400);
		});

		it("post user with existing email should return 400", async function () {
			const factoryUser = Factory.models.createUsers();
			await UserSchema.create(factoryUser);

			await Request.post("/api/auth/register")
				.send({
					email: factoryUser.email,
					name: "bob Test",
					password: "bob pa55word",
				})
				.expect(400);
		});
	});
});
