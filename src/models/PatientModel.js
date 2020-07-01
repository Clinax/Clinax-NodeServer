import { model, Schema } from "mongoose";
import { addressSchema, bloodGroup, gender } from "./metas";

import fullNameVirtual from "../modules/fullNameVirtual";
import autoNumberPlugin from "@safer-bwd/mongoose-autonumber";

var patientSchema = new Schema(
  {
    pid: {
      type: String,
      immutable: true,
      autonumber: true,
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
fullNameVirtual(patientSchema);

patientSchema.virtual("age").get(function () {
  if (!this.birthDate) return;

  let dateDif = new Date(Date.now() - this.birthDate.getTime());
  return dateDif.getFullYear() - 1970;
});

patientSchema.virtual("ageDetailed").get(function () {
  if (!this.birthDate) return;

  let dateDif = new Date(Date.now() - this.birthDate.getTime());

  let year = dateDif.getFullYear() - 1970;
  let month = dateDif.getMonth();
  let date = dateDif.getDate();

  // `${year} Years and ${month} months`;
  return { year, month, date };
});

patientSchema.set("toObject", { getters: true });

export default model("patient", patientSchema);
