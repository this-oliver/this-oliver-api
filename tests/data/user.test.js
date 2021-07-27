// database
const Database = require("../../src/database");

// framework
const Chai = require("chai");
const Expect = Chai.expect;
const ChaiAsPromise = require("chai-as-promised");
Chai.use(ChaiAsPromise);

// data
const UserSchema = require("../../src/models/user");
const User = require("../../src/data/user");

// helpers
const Factory = require("../factory");

describe("User in Models", function () {
	before(async function () {
		await Database.connect();
	});

	after(async function () {
		await Database.disconnect();
	});

	describe("[POST]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});

		it("post valid user", async function () {
			const dummy = Factory.models.createUsers();
			await User.postUser(dummy.name, dummy.email, dummy.password);
			const user = await UserSchema.findOne({ email: dummy.email });
			Expect(user.name).to.equal(dummy.name);
		});

		it("should not post user with existing email", async function () {
			const user = Factory.models.createUsers();
			await User.postUser(user.name, user.email, user.password);
			const registerUser = User.postUser(user.name, user.email, user.password);
			await Expect(registerUser).to.be.rejectedWith({
				status: 400,
				message: "User already exists",
			});
		});

		it("should not post user without name/email/password", async function () {
			await Expect(User.postUser("", "", "")).to.be.rejectedWith({
				status: 400,
				message: "user values are invalid",
			});
		});
	});

	describe("[GET]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});

		it("getAllUsers return empty list", async function () {
			const users = await User.getAllUsers();
			Expect(users.length).to.equal(0);
		});

		it("getAllUsers should return all five users", async function () {
			const factoryUsers = Factory.models.createUsers(5);
			await UserSchema.create(factoryUsers);

			const users = await User.getAllUsers();
			Expect(users.length).to.equal(5);
		});

		it("get user with invalid _id should throw expected error", async function () {
			const invalidId = Factory.mongo.createObjectId();
			const getUser = User.getSingleUser(invalidId);
			await Expect(getUser).to.be.empty;
		});

		it("gets user with valid _id should return user", async function () {
			const factoryUser = Factory.models.createUsers();

			const createdUser = await UserSchema.create(factoryUser);
			const user = await User.getSingleUser(createdUser._id);
			Expect(user.name).to.equal(createdUser.name);
			Expect(user.email).to.equal(createdUser.email);
		});
	});

	describe("[PATCH]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});
		it("update valid user should return updated user", async function () {
			const factoryUsers = Factory.models.createUsers(2);

			const user = await User.postUser(
				factoryUsers[0].name,
				factoryUsers[0].email,
				factoryUsers[0].password
			);
			const patch = { name: factoryUsers[1].name, email: factoryUsers[1].email };

			const update = await User.updateUser(user._id, patch);
			Expect(update.name).to.equal(patch.name);
			Expect(update.email).to.equal(patch.email);
		});

		it("update invalid user should return error", async function () {
			const invalidUserId = Factory.mongo.createObjectId();
			const updateUser = User.updateUser(invalidUserId, {});
			await Expect(updateUser).to.be.rejectedWith({
				status: 404,
				message: "User does not exists",
			});
		});

		it("update user with email that already exists should throw error ", async function () {
			const factoryUsers = Factory.models.createUsers(2);

			const user1 = await UserSchema.create(factoryUsers[0]);
			const patch = { email: user1.email };

			const user2 = await UserSchema.create(factoryUsers[1]);
			const updateUser = User.updateUser(user2._id, patch);
			await Expect(updateUser).to.be.rejectedWith({
				status: 404,
				message: patch.email + " already exists",
			});
		});
	});

	describe("[DELETE]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});

		it("delete with valid _id user should be success", async function () {
			const factoryUser = Factory.models.createUsers();
			const user = await UserSchema.create(factoryUser);

			Expect(await UserSchema.estimatedDocumentCount()).to.equal(1);

			await User.deleteUser(user._id);
			Expect(await UserSchema.estimatedDocumentCount()).to.equal(0);
		});

		it("delete with invalid _id should throw error", async function () {
			const invalidUserId = Factory.mongo.createObjectId();
			const deleteUser = User.deleteUser(invalidUserId);
			await Expect(deleteUser).to.be.rejectedWith({
				status: 404,
				message: "User does not exists",
			});
		});
	});
});
