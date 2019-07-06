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
        enum: ["a+", "b+", "o+", "ab+", "a-", "b-", "o-", "ab-", "unknown"],
        lowercase: true,
    }
}