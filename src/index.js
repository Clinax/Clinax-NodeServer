import express from 'express';
import routes from './routes/routes';
import {
	urlencoded,
	json
} from 'body-parser';

import {
	mongoose
} from "./config/database.config";


const app = express();

app.use(json());
app.use(urlencoded({
	extended: true
}));

routes(app);
// listen for requests
app.listen(3000, () => {
	console.log("Server is listening on port 3000");
});