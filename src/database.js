require("dotenv").config();
const Database = require("mongoose");

process.env.MONGODB =
	process.env.NODE_ENV === "test"
		? process.env.DB_URI_TEST
		: process.env.DB_URI;

console.log({
	env: process.env.NODE_ENV,
	mongo: process.env.MONGODB,
	uri: process.env.DB_URI,
	testUri: process.env.DB_URI_TEST,
});


exports.connection = Database.connection;

exports.drop = async () => {
	return Database.connection.dropDatabase();
};

exports.connect = async () => {
	return await Database.connect(
		process.env.MONGODB,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		function (err) {
			if (err) {
				console.error(
					`Failed to connect to MongoDB with URI '${process.env.MONGODB}' and NODE_ENV '${process.env.NODE_ENV}'`
				);
				console.error(err.stack);
				process.exit(1);
			}
		}
	);
};

exports.disconnect = async () => {
	return await Database.disconnect();
};
