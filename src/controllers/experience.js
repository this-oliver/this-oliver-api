const ExperienceData = require("../data/experience");
const TokenHelper = require("../helpers/token");

exports.postExperience = async function (req, res) {
	const authenticated = await TokenHelper.authenticateRequest(req);
	if(authenticated === false) return res.status(401).send("invalid credentials");

	const userId = TokenHelper.extractToken(req);
	const data = req.body;

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
	const authenticated = await TokenHelper.authenticateRequest(req);
	if(authenticated === false) return res.status(401).send("invalid credentials");

	const xpId = req.params.id;
	const patch = req.body;

	try {
		const xp = await ExperienceData.updateExperience(xpId, patch);
		return res.status(200).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};

exports.deleteExperience = async function (req, res) {
	const authenticated = await TokenHelper.authenticateRequest(req);
	if(authenticated === false) return res.status(401).send("invalid credentials");

	const xpId = req.params.id;

	try {
		const xp = await ExperienceData.deleteExperience(xpId);
		return res.status(203).send(xp);
	} catch (error) {
		return res.status(error.status).send(error.message);
	}
};
