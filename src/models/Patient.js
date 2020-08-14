import autoNumberPlugin from "@safer-bwd/mongoose-autonumber";

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
} from "./types";

var patientSchema = new Schema(
  {
    pid: {
      type: String,
      immutable: true,
      autonumber: { prefix: () => "PID-" },
    },
    avatar,
    prefix: trimmedString,
    name: detailedname,
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed", "Separated"],
    },
    address: addressSchema,
    phone: trimmedString,
    email,
    birthDate: Date,
    gender,
    bloodGroup,
    familyHistory: trimmedString,
    occupation: trimmedString,
    pastHistory: trimmedString,
    medicalNote: trimmedString,
    emergencyContacts: [
      {
        name: trimmedString,
        phone: trimmedString,
        relation: trimmedString,
      },
    ],
    addedBy: user,
    createdAt: { type: Date, immutable: true, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

patientSchema.virtual("case", {
  ref: "case",
  localField: "_id",
  foreignField: "patient",
  justOne: true,
});

patientSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  return next();
});

// patientSchema.index({ "$**": "text" });
patientSchema.plugin(autoNumberPlugin);

addFullnameVirtual(patientSchema);

addAgeVirtual(patientSchema, "birthDate");

patientSchema.set("toObject", { getters: true });

export default model("patient", patientSchema);
