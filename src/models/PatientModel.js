import CaseSchema from "./CaseModel";

import { model, Schema } from "mongoose";
import { addressSchema, bloodGroup, gender } from "./metas";
import fullNameVirtual from "../modules/fullNameVirtual";

var patientSchema = new Schema(
  {
    avatar: { type: String, trim: true },
    name: {
      first: {
        type: String,
        select: true,
        required: [true, "Name is required"],
      },
      middle: String,
      last: {
        type: String,
        select: true,
      },
    },
    address: addressSchema,
    phone: String,
    email: {
      type: String,
      lowercase: true,
    },
    birthDate: Date,
    gender,
    bloodGroup,
    familyHistory: String,
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
  },
  { timestamps: true }
);

patientSchema.virtual("case", {
  ref: "case",
  localField: "_id",
  foreignField: "patient",
  justOne: true,
});

// patientSchema.index({ "$**": "text" });

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
