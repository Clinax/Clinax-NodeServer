import {
    nLength
} from "../utils";

export default {
    addressSchema: {
        streetAddress: String,
        city: String,
        State: String,
        pincode: {
            type: Number,
            validate: (v) => nLength(v) == 6,
        }
    },
    bloodGroups: {
        type: String,
        enum: ["a+", "b+", "o+", "ab+", "a-", "b-", "o-", "ab-"]
    }
}