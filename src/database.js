require("dotenv").config();
const db = require("mongoose");

const connect = async () => {
	const MongoUri = process.env.NODE_ENV === "test"
		? process.env.DB_URI_TEST
		: process.env.DB_URI;

	return await db.connect(
		MongoUri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		function (err) {
			if (err) {
				console.error(
					`Failed to connect to MongoDB with URI '${MongoUri}' and NODE_ENV '${process.env.NODE_ENV}'`
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
