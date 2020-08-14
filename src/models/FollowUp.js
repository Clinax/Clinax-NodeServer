import { model, Schema } from "mongoose";
import { trimmedString } from "./types";

const followUpSchema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "case" },

    chiefComplain: trimmedString,
    femaleComplain: trimmedString,

    criteria: { type: {}, default: {} },
    physicalGeneral: { type: {}, default: {} },
    onExamination: { type: {}, default: {} },
    extra: { type: {}, default: {} },

    treatment: {
      type: new Schema({
        drugs: [
          {
            name: trimmedString,
            potency: trimmedString,
            dosage: trimmedString,
            duration: Number,
          },
        ],
        parallelTreatment: trimmedString,
        diagnosis: trimmedString,
      }),
      default: { drugs: [] },
    },
    nextFollowUpDate: Date,
  },
  { timestamps: true }
);

followUpSchema.virtual("fee", {
  ref: "followUpFee",
  localField: "_id",
  foreignField: "followUp",
  justOne: true,
});

followUpSchema.set("toObject", { getters: true });

export default model("followUp", followUpSchema);
