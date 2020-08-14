import { model, Schema } from "mongoose";

import {
  user,
  email,
  gender,
  avatar,
  bloodGroup,
  addAgeVirtual,
  addressSchema,
  detailedname,
  addFullnameVirtual,
  trimmedString,
  contactType,
} from "./types";

const userContactSchema = new Schema(
  {
    type: contactType,
    avatar,
    name: detailedname,
    phone: trimmedString,
    email,
    address: addressSchema,
    addedBy: user,
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed", "Separated"],
    },
    gender,
    bloodGroup,
    occupation: trimmedString,
    birthDate: Date,
  },
  { timestamps: true }
);

addFullnameVirtual(userContactSchema);

userContactSchema.virtual("displayName").get(function () {
  return this.prefixFullname || this.phone || this.email;
});

addAgeVirtual(userContactSchema, "birthDate");

userContactSchema.set("toObject", { getters: true });

export default model("userContact", userContactSchema);
