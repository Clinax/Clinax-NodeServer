import { Schema, model } from "mongoose";
import { amountType } from "./types";

const feeSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "patient" },
    followUp: { type: Schema.Types.ObjectId, ref: "followUp" },
    paid: { type: Boolean, default: () => false },
    visitingCharges: amountType,
    extraCharges: [{ name: String, amountType }],
  },
  { timestamps: true }
);

feeSchema.virtual("totalCharge").get(function () {
  const amount = this.extraCharges
    .map((e) => e.amount)
    .reduce((a, b) => a + b, 0);
  return this.visitingCharges + amount;
});

feeSchema.set("toObject", { getters: true });

export default model("followUpFee", feeSchema);
