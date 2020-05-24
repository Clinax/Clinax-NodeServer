import { Schema } from "mongoose";
import { SchemaTypes } from "../utils";

export const bloodGroup = {
  type: String,
  enum: ["a+", "b+", "o+", "ab+", "a-", "b-", "o-", "ab-", "unknown"],
  lowercase: true,
  default: "unknown",
};

export const addressSchema = new Schema(
  {
    street: SchemaTypes.trimmedString,
    area: SchemaTypes.trimmedString,
    pincode: {
      type: String,
      validate: (v) => String(v).length == 6,
    },
  },
  { timestamps: false }
);

export const gender = {
  type: String,
  lowercase: true,
  enum: ["male", "female", "non-binary"],
};
