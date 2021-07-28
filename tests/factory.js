const mongoose = require("mongoose");

exports.mongo = {
	createObjectId: () => {
		return mongoose.Types.ObjectId();
	}, 
};

exports.models = {
	createUsers: (num = 1) => {
		if (num <= 1) {
			return {
				name: "user 0",
				email: "user0@mail.com",
				password: "password",
			};
		} else {
			const users = [];
			for (let i = 0; i < num; i++) {
				users.push({
					name: `user${i}`,
					email: `user${i}@mail.com`,
					password: `password${i}`,
				});
			}
			return users;
		}
	},
	createArticle: (
		author,
		publish,
		title = "test title",
		content = "content for stuff to test"
	) => {
		return {
			title: title,
			content: content,
			author: author,
			publish: publish,
		};
	},
};
