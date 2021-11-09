// data
const UserData = require("../data/user");
const TokenHelper = require("../helpers/token");

exports.getOliver = async function (req, res) {

	try {
		const user = await UserData.getOliver();
		
		if (!user) {
			return res.status(404).send("user not found");
		} else {
			return res.status(200).send(user);
		}

	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.getAdmin = async function (req, res) {
	
	try {
		const authenticated = await TokenHelper.authenticateRequest(req);
		if(authenticated === false) return res.status(401).send("invalid credentials");

		const user = await UserData.getOliver(true);

		return res.status(200).send(user);
	} catch (error) {
		return res.status(error.status || 401).send(error.message);
	}
};

exports.patch = async function (req, res) {
	const authenticated = await TokenHelper.authenticateRequest(req);
	if(authenticated === false) return res.status(401).send("invalid credentials");
	
	try {
		const patch = req.body;
		const user = await UserData.getOliver();
		const updatedUser = await UserData.updateUser(user._id, patch);
		return res.status(200).send(updatedUser);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.incrementVisits = async function (req, res) {
	try {
		const user = await UserData.getOliver();
		const updateUser = await UserData.incrementUserVisits(user._id);
		return res.status(200).send(updateUser);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

// !disabled
exports.delete = async function (req, res) {
	// eslint-disable-next-line no-constant-condition
	if(true) return;

	const authenticated = await TokenHelper.authenticateRequest(req);
	if(authenticated === false) return res.status(401).send("invalid credentials");

	const userId = req.params.userId;
	const user = await UserData.getUser(userId);

	try {
		await UserData.deleteUser(user._id);
		return res.status(200).send(`deleted ${userId}`);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
