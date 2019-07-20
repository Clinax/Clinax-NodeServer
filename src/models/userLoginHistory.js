import { Schema, model } from "mongoose";

const ulhSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  userIp: {
    type: String,
    required: true,
    default: "No IP found"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const ULHModel = model("UserLoginHistory", ulhSchema);
