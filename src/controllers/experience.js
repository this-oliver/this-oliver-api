const ExperienceData = require("../data/experience");
const TokenHelper = require("../helpers/token");

exports.postExperience = async function (req, res) {
	let userId = null;
	const data = req.body;

	try {
		const decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);
		userId = decoded.data;
		
	} catch (error) {
		return res.status(error.status || 401).send(error.message);
	}

	try {
		const xp = await ExperienceData.postExperience(userId, data.title, data.org, data.startYear, data.endYear, data.description, data.type);
		return res.status(201).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.indexExperiences = function (req, res) {
	try {
		const xp = ExperienceData.indexExperiences();
		return res.status(200).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.getExperience = function (req, res) {
	const xpId = req.params.id;

	try {
		const xp = ExperienceData.getExperience(xpId);
		return res.status(200).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.patchExperience = async function (req, res) {
	const xpId = req.params.id;
	const patch = req.body;

	try {
		const decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);

		const xp = await ExperienceData.getExperience(xpId);

		if (xp.author != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials", 
			};
		}
	} catch (error) {
		return res.status(error.status || 401).send(error.message);
	}

	try {
		const xp = await ExperienceData.updateExperience(xpId, patch);
		return res.status(200).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.deleteExperience = async function (req, res) {
	const xpId = req.params.id;

	try {
		const decoded = TokenHelper.verifyToken(req.headers.authorization.split(" ")[1]);

		const xp = await ExperienceData.getExperience(xpId);

		if (xp.author != decoded.data) {
			throw {
				status: 401,
				message: "invalid credentials", 
			};
		}
	} catch (error) {
		return res.status(error.status || 401).send(error.message);
	}

	try {
		const xp = await ExperienceData.deleteExperience(xpId);
		return res.status(203).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
