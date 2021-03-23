// database
const DB = require("../../src/database");

// framework
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromise = require("chai-as-promised");
chai.use(chaiAsPromise);

// data
const UserSchema = require("../../src/models/user");
const User = require("../../src/data/user");

// helpers
const Factory = require("../factory");

describe("User Modal in Data", function () {
	before(async function () {
		await DB.connect();
	});

	after(async function () {
		await DB.disconnect();
	});

	describe("[POST]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});

		it("post valid user", async function () {
			let dummy = Factory.models.createUsers();
			await User.postUser(dummy.name, dummy.email, dummy.password);
			let user = await UserSchema.findOne({ email: dummy.email });
			expect(user.name).to.equal(dummy.name);
		});

		it("should not post user with existing email", async function () {
			let user = Factory.models.createUsers();
			await User.postUser(user.name, user.email, user.password);
			let registerUser = User.postUser(user.name, user.email, user.password);
			await expect(registerUser).to.be.rejectedWith({
				status: 400,
				message: "User already exists",
			});
		});

		it("should not post user without name/email/password", async function () {
			await expect(User.postUser("", "", "")).to.be.rejectedWith({
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
			let users = await User.getAllUsers();
			expect(users.length).to.equal(0);
		});

		it("getAllUsers should return all five users", async function () {
			let factoryUsers = Factory.models.createUsers(5);
			await UserSchema.create(factoryUsers);

			let users = await User.getAllUsers();
			expect(users.length).to.equal(5);
		});

		it("get user with invalid _id should throw expected error", async function () {
			let invalidId = Factory.mongo.createObjectId();
			let getUser = User.getSingleUser(invalidId);
			await expect(getUser).to.be.empty;
		});

		it("gets user with valid _id should return user", async function () {
			let factoryUser = Factory.models.createUsers();

			let createdUser = await UserSchema.create(factoryUser);
			let user = await User.getSingleUser(createdUser._id);
			expect(user.name).to.equal(createdUser.name);
			expect(user.email).to.equal(createdUser.email);
		});
	});

	describe("[PATCH]", function () {
		beforeEach(async function () {
			await UserSchema.deleteMany({});
		});
		it("update valid user should return updated user", async function () {
			let factoryUsers = Factory.models.createUsers(2);

			let user = await User.postUser(
				factoryUsers[0].name,
				factoryUsers[0].email,
				factoryUsers[0].password
			);
			let patch = { name: factoryUsers[1].name, email: factoryUsers[1].email };

			let update = await User.updateUser(user._id, patch);
			expect(update.name).to.equal(patch.name);
			expect(update.email).to.equal(patch.email);
		});

		it("update invalid user should return error", async function () {
			let invalidUserId = Factory.mongo.createObjectId();
			let updateUser = User.updateUser(invalidUserId, {});
			await expect(updateUser).to.be.rejectedWith({
				status: 404,
				message: "User does not exists",
			});
		});

		it("update user with email that already exists should throw error ", async function () {
			let factoryUsers = Factory.models.createUsers(2);

			let user1 = await UserSchema.create(factoryUsers[0]);
			let patch = { email: user1.email };

			let user2 = await UserSchema.create(factoryUsers[1]);
			let updateUser = User.updateUser(user2._id, patch);
			await expect(updateUser).to.be.rejectedWith({
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
			let factoryUser = Factory.models.createUsers();
			let user = await UserSchema.create(factoryUser);

			expect(await UserSchema.estimatedDocumentCount()).to.equal(1);

			await User.deleteUser(user._id);
			expect(await UserSchema.estimatedDocumentCount()).to.equal(0);
		});

		it("delete with invalid _id should throw error", async function () {
			let invalidUserId = Factory.mongo.createObjectId();
			let deleteUser = User.deleteUser(invalidUserId);
			await expect(deleteUser).to.be.rejectedWith({
				status: 404,
				message: "User does not exists",
			});
		});
	});
});
