const ExperienceData = require("../data/xp");
const TokenHelper = require("../helpers/token");

exports.postExperience = async function (req, res) {
	let userId = null;
	const data = req.body;

	try {
		userId = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}

	try {
		const xp = await ExperienceData.postExperience(userId, data.title, data.org, data.startYear, data.endYear, data.description, data.type);
		return res.status(201).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.getAllExperiences = function (req, res) {
	try {
		const xp = ExperienceData.getAllExperiences();
		return res.status(200).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.getSingleExperience = function (req, res) {
	const xpId = req.params.xpId;

	try {
		const xp = ExperienceData.getSingleExperience(xpId);
		return res.status(200).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.patchExperience = async function (req, res) {
	const xpId = req.params.xpId;
	const patch = req.body;

	try {
		const decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);

		const xp = await ExperienceData.getSingleExperience(xpId);

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
		const xp = await ExperienceData.updateExperience(xpId, patch);
		return res.status(200).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.deleteExperience = async function (req, res) {
	const xpId = req.params.xpId;

	try {
		const decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);

		const xp = await ExperienceData.getSingleExperience(xpId);

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
		const xp = await ExperienceData.deleteExperience(xpId);
		return res.status(203).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
