import { Schema, model } from "mongoose";
import { user } from "./types";
import validate from "mongoose-validator";

const loginRecordSchema = new Schema(
  {
    user: user,
    userAgent: String,
    ip: {
      type: String,
      validate: [
        validate({
          validator: "isIP",
          passIfEmpty: true,
          message: "Invalid IP",
        }),
      ],
    },
  },
  { timestamps: true }
);

export default model("loginRecord", loginRecordSchema);
