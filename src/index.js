require("dotenv").config();

import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import routes from "./routes";
import express from "express";
import requestIp from "request-ip";
import compression from "compression";
import fileUpload from "express-fileupload";
import queryPaser from "./utils/queryPaser";

// import io from "socket.io";
import { urlencoded, json } from "body-parser";
import { create404 } from "./utils/httpErrors";

import "./init";
import "./config/database";

global.APP_ROOT = process.cwd();

const app = express();

app.set("trust proxy", 1); // trust first proxy

app.use(express.static(global.APP_ROOT + "/uploads/"));
app.use(express.static(global.APP_ROOT + "/static/"));

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
  console.log("Port '" + process.env.port + "' not available: " + err);
});

// global.IO = io(server);
