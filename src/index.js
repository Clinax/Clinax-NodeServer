import express from 'express';
import {
	urlencoded,
	json
} from 'body-parser';

import url from './config/database.config.js';
import routes from './routes/routes.js';

import _ from "./utils/init.js"

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(url, {
	useNewUrlParser: true
}).then(() => {
	console.log("Successfully connected to the database: ", url);
}).catch(err => {
	console.error('Could not connect to the database[' + url + ']. Exiting now...', err);
	process.exit();
});

const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(urlencoded({
	extended: true
}));



// parse requests of content-type - application/json
app.use(json());

routes(app); // assign all the routes to the app

// listen for requests
app.listen(3000, () => {
	console.log("Server is listening on port 3000");
});