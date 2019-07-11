import express from 'express';
import routes from './routes/routes';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import requestIp from 'request-ip';
import compression from 'compression';
import helmet from 'helmet';

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
// import {
// 	PatientModel
// } from './models/patient';
import {
	verifyToken
} from './controllers/user';
import {
	create400
} from './utils';

const MongoStore = require('connect-mongo')(session);

const app = express();
global.appRoot = __dirname;

app.use(helmet());
app.use(compression());

app.use(express.static(appRoot + '/uploads/img/'));

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

// app.use("/clearAll", (_, res) =>
// 	PatientModel.deleteMany({}, (_, response) => res.json(response))
// )

app.use(cors({
	credentials: true,
	origin: true
}));

app.use('*', (req, res, next) => {
	if (req.params[0].indexOf('auth') == -1) {
		let match = /\/([a-zA-Z0-9]+)\//gm.exec(req.params[0]);
		let token = (match && match[1]) || req.body.token;
		verifyToken(token, _ => next(), err => create400(res, null, err))
	} else next();
})

routes(app);
// listen for requests
app.listen(config.port, () => {
	console.log("Server is listening on port 3000");
});