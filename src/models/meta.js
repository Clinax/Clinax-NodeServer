import {
    nLength
} from "../utils";

export default {
    addressSchema: {
        streetAddress: {
            type: String,
            trim: true
        },
        region: {
            type: String,
            trim: true
        },
        pincode: {
            type: Number,
            validate: (v) => nLength(v) == 6,
        }
    },
    bloodGroups: {
        type: String,
        enum: ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-", "unknown"]
    }
}