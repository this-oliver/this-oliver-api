require("dotenv").config();
let express = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");

let router = require("./controllers/router");

let app = express();

// Parse requests of content-type 'application/json'
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

if (process.env.NODE_ENV == "dev") {
	let morgan = require("morgan");
	app.use(morgan("dev"));
}

app.use(router);

let env = app.get("env");
app.use(function (err, req, res, next) {
	console.error(err.stack);
	let err_res = {
		message: err.message,
		error: {},
	};
	if (env.NODE_ENV == "dev") {
		err_res.error = err;
	}
	res.status(err.status || 500);
	res.json(err_res);
});

module.exports = app;
