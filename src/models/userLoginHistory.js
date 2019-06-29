import {
    Schema,
    model
} from "mongoose";

const ulhSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userIp: {
        type: String,
        required: true,
        default: "No IP found"
    },
    token: {
        type: String,
        required: true,
        index: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

export const ULHModel = model("UserLoginHistory", ulhSchema);