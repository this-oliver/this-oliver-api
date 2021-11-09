const UserData = require("../data/user");
const TokenHelper = require("../helpers/token");

exports.authenticateRequest = async function(req){
	if(req === undefined || req === null) return false;
	if(req.headers.authorization === undefined || req.headers.authorization === null) return false;
	
	const token = req.headers.authorization.split(" ")[1];
	let decoded = undefined;

	try {
		decoded = TokenHelper.verifyToken(token);
	} catch (error) {
		console.log({ decodeError: error });
		return false;
	}

	try {
		const Admin = await UserData.getOliver();

		return Admin._id == decoded;
	} catch (error) {
		console.log( { authError: error } );
		return false;
	}
};
