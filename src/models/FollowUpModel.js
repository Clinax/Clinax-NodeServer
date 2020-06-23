import { model, Schema } from "mongoose";
import { SchemaTypes } from "../utils";

const followUpSchema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "case" },

    chiefComplain: SchemaTypes.trimmedString,
    femaleComplain: SchemaTypes.trimmedString,

    criteria: {},
    physicalGeneral: {},
    onExamination: {},
    extra: {},

    treatment: {
      type: new Schema({
        drugs: [
          {
            name: SchemaTypes.trimmedString,
            potency: SchemaTypes.trimmedString,
            dosage: SchemaTypes.trimmedString,
            duration: Number,
          },
        ],
        parallelTreatment: SchemaTypes.trimmedString,
        diagnosis: SchemaTypes.trimmedString,
      }),
      default: { drugs: [] },
    },
    nextFollowUpDate: Date,
  },
  { timestamps: true }
);

export default model("followUp", followUpSchema);
