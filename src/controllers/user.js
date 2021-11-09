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
		const decoded = TokenHelper.verifyToken(
			req.headers.authorization.split(" ")[1]
		);

		const user = await UserData.getOliver(true);

		if (!user) {
			throw {
				status: 404,
				message: "user not found",
			};
		}

		if (user._id != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials",
			};
		}

		return res.status(200).send(user);
	} catch (error) {
		return res.status(error.status || 401).send(error.message);
	}
};

exports.patch = async function (req, res) {
	let user = null;
	const patch = req.body;

	try {
		const decoded = TokenHelper.verifyToken(
			req.headers.authorization.split(" ")[1]
		);

		user = await UserData.getOliver();

		if (user._id != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials",
			};
		}
	} catch (error) {
		return res.status(error.status || 401).send(error.message);
	}

	try {
		user = await UserData.updateUser(user._id, patch);
		return res.status(200).send(user);
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

	const userId = req.params.userId;
	let user = null;

	try {
		const decoded = TokenHelper.verifyToken(
			req.headers.authorization.split(" ")[1]
		);

		user = await UserData.getUser(userId);

		if (user._id != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials",
			};
		}
	} catch (error) {
		return res.status(error.status || 401).send(error.message);
	}

	try {
		await UserData.deleteUser(user._id);
		return res.status(200).send(`deleted ${userId}`);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
