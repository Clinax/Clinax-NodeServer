import { model, Schema } from "mongoose";
import { trimmedString } from "./types";

const inventoryTodoSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    name: { ...trimmedString, required: true },
    potency: { 30: Boolean, 200: Boolean, "1m": Boolean, mt: Boolean },
  },
  { timestamps: true }
);

inventoryTodoSchema.set("toObject", { getters: true });

export default model("inventoryTodo", inventoryTodoSchema);
