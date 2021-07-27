const ExperienceData = require("../data/xp");
const TokenHelper = require("../helpers/token");

exports.postExperience = async function (req, res) {
	let userId = null;
	let data = req.body;

	try {
		userId = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	try {
		let xp = await ExperienceData.postExperience(userId, data.title, data.org, data.startYear, data.endYear, data.description, data.type);
		return res.status(201).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.getAllExperiences = function (req, res) {
	try {
		let xp = ExperienceData.getAllExperiences();
		return res.status(200).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.getSingleExperience = function (req, res) {
	let xpId = req.params.xpId;

	try {
		let xp = ExperienceData.getSingleExperience(xpId);
		return res.status(200).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.patchExperience = async function (req, res) {
	let xpId = req.params.xpId;
	let patch = req.body;

	try {
		let decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);

		let xp = await ExperienceData.getSingleExperience(xpId);

		if (xp.author != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials",
			};
		}
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	try {
		let xp = await ExperienceData.updateExperience(xpId, patch);
		return res.status(200).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.deleteExperience = async function (req, res) {
	let xpId = req.params.xpId;

	try {
		let decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);

		let xp = await ExperienceData.getSingleExperience(xpId);

		if (xp.author != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials",
			};
		}
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	try {
		let xp = await ExperienceData.deleteExperience(xpId);
		return res.status(203).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
