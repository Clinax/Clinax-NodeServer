import sha256 from "js-sha256";

import { Schema, model } from "mongoose";
import {
  gender,
  addFullnameVirtual,
  detailedname,
  email,
  avatar,
} from "./types";

var userSchema = new Schema(
  {
    avatar,
    name: detailedname,
    birthDate: { type: Date, alias: "dateOfBirth" },
    gender,
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    phone: String,
    email: { ...email, unique: true },
    password: {
      type: String,
      select: false,
      required: [true, "Password is required"],
      set: (v) => sha256(v),
    },
  },
  { timestamps: true }
);

addFullnameVirtual(userSchema);

userSchema.set("toObject", { virtuals: true });

export default model("user", userSchema);
