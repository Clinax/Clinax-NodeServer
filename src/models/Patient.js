import autoNumberPlugin from "@safer-bwd/mongoose-autonumber";

import { model, Schema } from "mongoose";
import {
  gender,
  bloodGroup,
  addAgeVirtual,
  addressSchema,
  addFullnameVirtual,
} from "./types";

var patientSchema = new Schema(
  {
    pid: {
      type: String,
      immutable: true,
      autonumber: {
        prefix: () => "PID-",
      },
    },
    avatar: { type: String, trim: true },
    prefix: String,
    name: {
      first: {
        type: String,
        select: true,
        required: [true, "Name is required"],
      },
      middle: String,
      last: { type: String, select: true },
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed", "Separated"],
    },
    address: addressSchema,
    phone: String,
    email: { type: String, lowercase: true },
    birthDate: Date,
    gender,
    bloodGroup,
    familyHistory: String,
    occupation: String,
    pastHistory: String,
    medicalNote: String,
    emergencyContacts: [
      {
        name: String,
        phone: String,
        relation: String,
      },
    ],
    addedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "doctor",
    },
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
