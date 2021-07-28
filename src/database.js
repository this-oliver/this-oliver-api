require("dotenv").config();
const db = require("mongoose");

process.env.MONGODB =	process.env.NODE_ENV === "test"		? process.env.DB_URI_TEST		: process.env.DB_URI;

const connect = async () => {
	return await db.connect(
		process.env.MONGODB,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		function (err) {
			if (err) {
				console.error(
					`Failed to connect to MongoDB with URI: ${process.env.MONGODB}`
				);
				console.error(err.stack);
				process.exit(1);
			}
		}
	);
};

const connection = () => {
	return db.connection;
};

const disconnect = async () => {
	return await db.disconnect();
};

module.exports = { connect, connection, disconnect };
