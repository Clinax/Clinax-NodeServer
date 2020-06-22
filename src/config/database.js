require("dotenv").config();

import mongoose from "mongoose";
import { isProduction } from "../utils";

mongoose.Promise = global.Promise;

const mongoUrl = isProduction()
  ? process.env.MONGODB_URL
  : process.env.MONGODB_URL_DEBUG;

mongoose
  .connect(mongoUrl, {
    // FIX for: DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Successfully connected to the database:", mongoUrl);
  })
  .catch((err) => {
    console.error(
      "Could not connect to the database (" + mongoUrl + "). Exiting now...",
      err
    );
    process.exit();
  });
