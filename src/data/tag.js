// mongo
const TagSchema = require("../models/tag");

exports.createTag = async (name) => {
	try {
		const tag = await TagSchema.create(new TagSchema({ name: name }));
		return tag;
	} catch (error) {
		throw {
			status: 400,
			message: error, 
		};
	}
};

exports.indexTags = async () => {
	try {
		return await TagSchema.find().exec();
	} catch (error) {
		throw {
			status: 400,
			message: error, 
		};
	}
};

exports.getTag = async (id) => {
	if (!id) {
		throw {
			status: 400,
			message: "missing id", 
		};
	}

	try {
		const tag = await TagSchema.findById(id).exec();
		return tag;
	} catch (error) {
		throw {
			status: 400,
			message: error, 
		};
	}
};

exports.deleteTag = async (id) => {
	try {
		let tag = await this.getTag(id);
		tag = await tag.remove();

		return `${tag.title} with id ${id} deleted`;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || error, 
		};
	}
};

exports.cleanTags = async (dirtyList) => {
	if (!dirtyList) {
		return [];
	}

	try {
		const cleanList = []; // list of tags
		const allTags = await this.indexTags();

		for (let x = 0; x < dirtyList.length; x++) {
			const dirtyTag = dirtyList[x];
			let found = false;

			for (let i = 0; i < allTags.length; i++) {
				const cleanTag = allTags[i];
				if (dirtyTag.toLowerCase() == cleanTag.name.toLowerCase()) {
					found = true;
					cleanList.push(cleanTag._id);
					break;
				}
			}

			if (!found) {
				const newTag = await this.createTag(dirtyTag);
				cleanList.push(newTag._id);
			}
		}

		return cleanList;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message, 
		};
	}
};
