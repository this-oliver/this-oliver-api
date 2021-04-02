// mongo
const TagSchema = require("../models/tag");

exports.createTag = async (name) => {
	try {
		let tag = await TagSchema.create(new TagSchema({ name: name }));
		return tag;
	} catch (error) {
		throw {
			status: 400,
			message: error,
		};
	}
};

exports.cleanTags = async (dirtyList) => {
	if (!dirtyList) {
		throw {
			status: 400,
			message: "tags are missing",
		};
	}

	try {
		let cleanList = []; // list of tags
		let allTags = await this.getAllTags();

		for (let x = 0; x < dirtyList.length; x++) {
			let dirtyTag = dirtyList[x];
			let found = false;

			for (let i = 0; i < allTags.length; i++) {
				let cleanTag = allTags[i];
				if (dirtyTag.toLowerCase() == cleanTag.name.toLowerCase()) {
					found = true;
					cleanList.push(cleanTag._id);
					break;
				}
			}

			if (!found) {
				let newTag = await this.createTag(dirtyTag);
				cleanList.push(newTag._id);
			}
		}

		return cleanList;
	} catch (error) {
		throw {
			status: error.status,
			message: error.message,
		};
	}
};

exports.getAllTags = async () => {
	try {
		return await TagSchema.find().exec();
	} catch (error) {
		throw {
			status: 400,
			message: error,
		};
	}
};

exports.getSingleTag = async (id) => {
	if (!id) {
		throw {
			status: 400,
			message: "missing id",
		};
	}

	try {
		let tag = await TagSchema.findById(id).exec();
		return tag;
	} catch (error) {
		throw {
			status: 400,
			message: error,
		};
	}
};

exports.updateTag = async (id, patch) => {
	if (!id) {
		throw {
			status: 400,
			message: "missing id",
		};
	}
};

exports.deleteTag = async (id) => {
	try {
		let tag = await this.getSingleTag(id);
		tag = await tag.remove();

		return `${tag.title} with id ${id} deleted`;
	} catch (error) {
		throw {
			status: error.status,
			message: error.message || error,
		};
	}
};
