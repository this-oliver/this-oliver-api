// mongo
const ExperienceSchema = require("../models/xp");
const UserData = require("./user");

exports.postExperience = async (userId,
	title,
	org,
	startYear,
	endYear,
	description,
	type) => {
	let user = null;

	try {
		user = await UserData.getSingleUser(userId);
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message, 
		};
	}

	try {
		const xp = await ExperienceSchema.create(new ExperienceSchema({
			title: title,
			org: org,
			startYear: startYear,
			endYear: endYear,
			description: description,
			type: type,
			author: userId, 
		}));

		user.experiences.push(xp);
		await user.save();
		return xp;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error, 
		};
	}
};

exports.indexExperiences = async () => {
	try {
		return await ExperienceSchema.find().exec();
	} catch (error) {
		throw {
			status: 400,
			message: error.message || error, 
		};
	}
};

exports.getSingleExperience = async (id) => {
	if (!id) {
		throw {
			status: 400,
			message: "missing id", 
		};
	}

	try {
		const xp = await ExperienceSchema.findById(id).exec();

		if (!xp) {
			throw {
				status: 404,
				message: `experienc with id ${id} does not exist`, 
			};
		}

		return xp;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error, 
		};
	}
};

exports.updateExperience = async (id, patch) => {
	let xp = null;

	try {
		xp = await this.getSingleExperience(id);
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message, 
		};
	}

	try {
		xp.title = patch.title || xp.title;
		xp.org = patch.org || xp.org;
		xp.startYear = patch.startYear || xp.startYear;
		xp.endYear = patch.endYear || xp.endYear;
		xp.description = patch.description || xp.description;
		xp.type = patch.type || xp.type;

		xp = await xp.save();
		return xp;
	} catch (error) {
		throw {
			status: 400,
			message: error, 
		};
	}
};

exports.deleteExperience = async (id) => {
	try {
		let xp = await this.getSingleExperience(id);
		xp = await xp.remove();

		return `${xp.title} with id ${id} deleted`;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error, 
		};
	}
};
