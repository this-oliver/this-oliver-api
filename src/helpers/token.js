//auth
const Jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;
const UserData = require("../data/user");

exports.getToken = (value) => {
	const payload = { data: value };
	const signOptions = { expiresIn: "72h" };

	try {
		const token = Jwt.sign(payload, SECRET, signOptions);
		return token;
	} catch (error) {
		throw {
			status: 401,
			message: "error getting token:" + error.message || error,
		};
	}
};

exports.verifyToken = (token) => {
	if (!token)
		throw {
			status: 400,
			message: "missing token",
		};

	try {
		const decoded = Jwt.verify(token, SECRET);
		return decoded;
	} catch (error) {
		throw {
			status: 401,
			message: "error verifying token:" + error.message || error,
		};
	}
};

exports.extractToken = (req) => {
	if (req === undefined || req === null) return false;
	if (
		req.headers.authorization === undefined ||
		req.headers.authorization === null
	)
		return false;

	const token = req.headers.authorization.split(" ")[1];

	try {
		return this.verifyToken(token);
	} catch (error) {
		console.log({ decodeError: error });
		return false;
	}
};

exports.authenticateRequest = async function (req) {
	if (req === undefined || req === null) return false;
	if (
		req.headers.authorization === undefined ||
		req.headers.authorization === null
	)
		return false;

	const token = req.headers.authorization.split(" ")[1];
	let decoded = undefined;

	try {
		decoded = this.verifyToken(token);
	} catch (error) {
		console.log({ decodeError: error });
		return false;
	}

	try {
		const admin = await UserData.getOliver();
		if (admin === undefined || admin === null)
			throw { status: 404, message: "host is missing" };

		return admin._id == decoded.data;
	} catch (error) {
		console.log({ authError: error });
		return false;
	}
};
