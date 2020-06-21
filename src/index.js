require("dotenv").config();

import express from "express";
import logger from "morgan";
import cors from "cors";
import requestIp from "request-ip";
import compression from "compression";
import helmet from "helmet";
import "core-js/stable";
import "regenerator-runtime/runtime";
import "./config/database";
// import io from "socket.io";
import fileUpload from "express-fileupload";
import { urlencoded, json } from "body-parser";

import routes from "./routes";

import "./init";
import queryPaser from "./modules/queryPaser";
import { create404 } from "./modules/httpErrors";

global.APP_ROOT = __dirname;

const app = express();

app.set("trust proxy", 1); // trust first proxy

app.use(express.static(APP_ROOT + "/uploads/"));
app.use(express.static(APP_ROOT + "/static/"));

app.use(logger("dev"));
app.use(helmet());
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(fileUpload());
app.use(requestIp.mw());
app.use(queryPaser);

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

routes(app);

app.use("*", (_, res) => {
  create404(res, "Page not found");
});

// listen for requests
app.listen(process.env.PORT, () => {
  console.log("Server is listening on port " + process.env.PORT);
});

app.addListener("close", (err) => {
  console.log("Port '" + port + "' not available: " + err);
});

// global.IO = io(server);
