import { Schema, model } from "mongoose";
import validate from "mongoose-validator";
import { user } from "./types";

const loginRecordSchema = new Schema(
  {
    user,
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
