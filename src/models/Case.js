import { Schema, model } from "mongoose";
import { trimmedString } from "./types";

const caseSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "patient", unique: true },

    mind: trimmedString,
    duringAcute: trimmedString,
    pastHistory: trimmedString,
    familyHistory: trimmedString,
    medicalNote: trimmedString,

    followUps: {
      type: [{ type: Schema.Types.ObjectId, ref: "followUp" }],
      select: false,
    },
  },
  { timestamps: true }
);

caseSchema.set("toObject", { getters: true });

export default model("case", caseSchema);
