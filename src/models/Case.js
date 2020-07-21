import { Schema, model } from "mongoose";
import { trimmedString, patient } from "./types";

const caseSchema = new Schema(
  {
    patient: { ...patient, unique: true },

    mind: trimmedString,
    duringAcute: trimmedString,
    pastHistory: trimmedString,
    familyHistory: trimmedString,
    medicalNote: trimmedString,

    followUps: {
      type: [{ type: Schema.Types.ObjectId, ref: "followUp" }],
      select: false,
    },
    investigations: [
      {
        name: String,
        entries: [{ reportDate: Date, values: {} }],
      },
    ],
  },
  { timestamps: true }
);

caseSchema.set("toObject", { getters: true });

export default model("case", caseSchema);
