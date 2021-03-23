require("dotenv").config();
let db = require("mongoose");

let mongoURI = "";
switch (process.env.NODE_ENV) {
	case "dev":
		mongoURI = "mongodb://localhost:27017/oli";
		break;
	case "test":
		mongoURI = "mongodb://localhost:27017/oli_test";
		break;
	default:
		mongoURI = process.env.DB_URI;
		break;
}
process.env.MONGODB = mongoURI;

let connect = async () => {
	return await db.connect(
		mongoURI,
		{ useNewUrlParser: true, useUnifiedTopology: true },
		function (err) {
			if (err) {
				console.error("Failed to connect to MongoDB with URI: " + mongoURI);
				console.error(err.stack);
				process.exit(1);
			}
		}
	);
};

let connection = () => {
	return db.connection;
};

let disconnect = async () => {
	return await db.disconnect();
};

module.exports = { connect, connection, disconnect };
