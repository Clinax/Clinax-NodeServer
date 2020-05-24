require("dotenv").config();

import mongoose from "mongoose";

mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MONGODB_URL, {
    // FIX for: DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(
      "Successfully connected to the database: ",
      process.env.MONGODB_URL
    );
  })
  .catch((err) => {
    console.error(
      "Could not connect to the database (" +
        process.env.MONGODB_URL +
        "). Exiting now...",
      err
    );
    process.exit();
  });
