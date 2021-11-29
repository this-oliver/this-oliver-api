const TagSchema = require("../models/tag");
const ArticleSchema = require("../models/article");
const ColorHelper = require("../helpers/color");

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

exports.indexTags = async (showSecrets = false) => {
	try {
		const tags = await TagSchema.find().exec();

		//! PATCH
		for (let i = 0; i < tags.length; i++) {
			const tag = tags[i];
			if (!tag.color) {
				tag.color = ColorHelper.getRandomColor({ light: true });
				await tag.save();
			}
		}
	} catch (error) {
		throw {
			status: 400,
			message: error,
		};
	}

	try {
		if (showSecrets) {
			return await TagSchema.find().exec();
		} else {
			const publicTags = [];
			const publicArticles = await ArticleSchema.find({ publish: true }).exec();
			const tags = await TagSchema.find().exec();

			for (let i = 0; i < tags.length; i++) {
				const tag = tags[i];

				for (let x = 0; x < publicArticles.length; x++) {
					const article = publicArticles[x];

					if (article.tags.includes(tag._id)) {
						publicTags.push(tag);
						break;
					}
				}
			}

			return publicTags;
		}
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
		const cleanList = [];
		const allTags = await this.indexTags(true);

		for (let x = 0; x < dirtyList.length; x++) {
			const dirtyTag = dirtyList[x];
			let found = false;

			// check if tag exists
			for (let i = 0; i < allTags.length; i++) {
				const cleanTag = allTags[i];

				if (dirtyTag.name.toLowerCase() == cleanTag.name.toLowerCase()) {
					found = true;
					cleanList.push(cleanTag._id);
					break;
				}
			}

			// if tag is not found, add it to list
			if (!found) {
				const newTag = await this.createTag(dirtyTag.name);
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
