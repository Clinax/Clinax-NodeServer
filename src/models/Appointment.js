import { Schema, model } from "mongoose";
import { trimmedString } from "./types";

const appointmentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "patient", immutable: false },
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
