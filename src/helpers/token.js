//auth
const Jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

exports.getToken = (value) => {
	const payload = { data: value };
	const signOptions = { expiresIn: "72h", };

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
