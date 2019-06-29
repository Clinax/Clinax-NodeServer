import express from 'express';
import routes from './routes/routes';
import {
	urlencoded,
	json
} from 'body-parser';

import "./init"
import {
	mongoose
} from "./config/database.config";
import config from './config/index.js';


const app = express();

app.use(json());
app.use(urlencoded({
	extended: true
}));

routes(app);
// listen for requests
app.listen(config.port, () => {
	console.log("Server is listening on port 3000");
});