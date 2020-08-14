import { Schema, model } from "mongoose";

const amount = {
  type: Number,
  min: 0,
  default: () => 0,
};

const feeSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "patient" },
    followup: { type: Schema.Types.ObjectId, ref: "followUp" },
    paid: { type: Boolean, default: () => false },
    visitingCharges: amount,
    extraCharges: [{ name: String, amount }],
  },
  { timestamps: true }
);

feeSchema.virtual("totalCharge").get(function () {
  let amount = this.extraCharges
    .map((e) => e.amount)
    .reduce((a, b) => a + b, 0);
  return this.visitingCharges + amount;
});

feeSchema.set("toObject", { getters: true });

export default model("followUpFee", feeSchema);
