require("dotenv").config();
const app = require("./app");
const db = require("./database");

const port = process.env.PORT || 3001;

db.connect().catch((error) => {
	console.error(error);
	return;
});

app.listen(port, function (err) {
	if (err) throw err;
	console.log("Express server listening on port " +			port +			", in " +			process.env.NODE_ENV +			" mode");
	console.log("Backend: http://localhost:" + port + "/api/");
	console.log("Mongo: " + process.env.MONGODB);
});

module.exports = app;
