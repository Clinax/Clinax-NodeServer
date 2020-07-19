import { Schema, model } from "mongoose";

const loginRecordSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userAgent: String,
    ip: {
      type: String,
      required: true,
      default: "-",
    },
  },
  { timestamps: true }
);

export default model("loginRecord", loginRecordSchema);
