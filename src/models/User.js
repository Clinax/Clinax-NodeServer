import sha256 from "js-sha256";

import { Schema, model } from "mongoose";
import { gender, addFullnameVirtual } from "./types";

var userSchema = new Schema(
  {
    avatar: { type: String, trim: true },
    name: {
      first: {
        type: String,
        required: [true, "Name is required"],
      },
      middle: String,
      last: String,
    },
    birthDate: { type: Date, alias: "dateOfBirth" },
    gender,
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    phoneNumber: String,
    email: {
      unique: true,
      type: String,
      lowercase: true,
    },
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
