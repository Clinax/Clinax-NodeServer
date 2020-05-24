import { Schema, model } from "mongoose";
import { SchemaTypes } from "../utils";

const caseSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "patient", unique: true },

    mind: SchemaTypes.trimmedString,
    duringAcute: SchemaTypes.trimmedString,
    pastHistory: SchemaTypes.trimmedString,
    familyHistory: SchemaTypes.trimmedString,
    medicalNote: SchemaTypes.trimmedString,

    followUps: {
      type: [{ type: Schema.Types.ObjectId, ref: "followUp" }],
      select: false,
    },
  },
  { timestamps: true }
);

caseSchema.set("toObject", { getters: true });

export default model("case", caseSchema);
