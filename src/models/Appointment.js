import { Schema, model } from "mongoose";
import { trimmedString, user, patient } from "./types";

const appointmentSchema = new Schema(
  {
    user,
    patient,
    name: trimmedString,
    contact: trimmedString,
    notes: trimmedString,
    dateTime: Date,
  },
  { timestamps: true }
);

appointmentSchema.virtual("patientName").get(function () {
  return (this.patient && this.patient.fullname) || this.name;
});

appointmentSchema.set("toObject", { getters: true });

export default model("appointment", appointmentSchema);
