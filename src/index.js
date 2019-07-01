import express from 'express';
import routes from './routes/routes';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import requestIp from 'request-ip';
import {
	urlencoded,
	json
} from 'body-parser';

import "./init"
import {
	mongoose
} from "./config/database.config";
import config from './config/index.js';
import fileUpload from 'express-fileupload';

const MongoStore = require('connect-mongo')(session);

const app = express();
global.appRoot = __dirname;

app.use(logger('dev'));

app.use(fileUpload());
app.use(cookieParser());
app.use(json());
app.use(urlencoded({
	extended: true
}));

app.use(requestIp.mw());

app.set('trust proxy', 1) // trust first proxy
app.use(session({
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	}),
	resave: true,
	saveUninitialized: true,
	secret: 'keyboard cat',
	cookie: {
		maxAge: 2 * 60 * 60 * 100
	}
}))

app.use(cors({
	credentials: true,
	origin: true
}));

routes(app);
// listen for requests
app.listen(config.port, () => {
	console.log("Server is listening on port 3000");
});