// data
const UserData = require("../data/user");

exports.getUser = async function (req, res) {

	try {
		const user = await UserData.getUser();
		
		if (!user) {
			return res.status(404).send("user not found");
		} else {
			return res.status(200).send(user);
		}

	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.incrementVisits = async function (req, res) {
	try {
		const user = await UserData.getUser();
		const updateUser = await UserData.incrementUserVisits(user._id);
		return res.status(200).send(updateUser);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
