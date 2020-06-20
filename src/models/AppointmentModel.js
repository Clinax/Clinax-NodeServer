import { Schema, model } from "mongoose";
import { SchemaTypes } from "../utils";

const appointmentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "patient" },
    name: SchemaTypes.trimmedString,
    contact: SchemaTypes.trimmedString,
    notes: SchemaTypes.trimmedString,
    dateTime: Date,
  },
  { timestamps: true }
);

appointmentSchema.set("toObject", { getters: true });

export default model("appointment", appointmentSchema);
