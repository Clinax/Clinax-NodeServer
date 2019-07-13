import CaseSchema from "./case.js";
import MetaSchema from "./meta.js";

import { model, Schema } from "mongoose";

var patientSchema = Schema(
  {
    avatar: {
      type: String,
      trim: true
    },
    name: {
      first: {
        type: String,
        select: true,
        required: [true, "Name is required"]
      },
      middle: String,
      last: {
        type: String,
        select: true
      }
    },
    dob: {
      type: Date
    },
    gender: {
      type: String,
      lowercase: true,
      enum: ["male", "female", "other"]
    },
    phoneNumber: String,
    email: {
      type: String,
      lowercase: true
    },
    address: MetaSchema.addressSchema,
    medicalNote: String,
    bloodGroup: MetaSchema.bloodGroups,
    emergencyContact: {
      name: String,
      phoneNumber: String,
      relationShip: String
    },
    caseId: Schema.Types.ObjectId,
    doctorId: {
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
);

patientSchema.index({
  "$**": "text"
});

patientSchema.virtual("intials").get(function() {
  return this.name.first[0] + (this.name.last[0] || "");
});

patientSchema
  .virtual("fullName")
  .get(function() {
    return (
      this.name.first +
      " " +
      (this.name.middle || "") +
      " " +
      (this.name.last || "")
    ).replace("  ", " ");
  })
  .set(function(v) {
    let t = v.split(" ");

    this.name.first = t[0];
    if (t[2]) {
      this.name.middle = t[1];
      this.name.last = t[2];
    } else this.name.last = t[1];
  });

patientSchema.virtual("age").get(function() {
  let dateDif = Date.now() - this.dob.getTime();
  return new Date(dateDif).getFullYear() - 1970;
});

patientSchema.virtual("ageDetailed").get(function() {
  let dateDif = new Date(Date.now() - this.dob.getTime());
  let year = dateDif.getFullYear() - 1970;
  let month = dateDif.getMonth();
  return `${year} Years and ${month} months`;
});

patientSchema.set("toObject", { virtuals: true });

export const PatientModel = model("Patient", patientSchema);
