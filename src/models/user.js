import {
    Schema,
    model
} from "mongoose";

import sha256 from "js-sha256";

var userSchema = Schema({
    avatar: {
        type: String,
        trim: true,
    },
    name: {
        first: {
            type: String,
            select: true,
            required: [true, "Name is required"],
        },
        middle: String,
        last: {
            type: String,
            select: true
        },
    },
    dob: {
        type: Date,
        alias: "dateOfBirth",
    },
    gender: {
        type: String,
        lowercase: true,
        enum: ['m', 'f', 'o']
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    phoneNumber: String,
    email: {
        unique: true,
        type: String,
        lowercase: true
    },
    password: {
        type: String,
        select: false,
        required: [true, "Password is required"],
        set: (v) => sha256(v),
    },
}, {
    timestamps: true
})

userSchema.virtual('fullName')
    .get(function () {
        return (this.name.first + ' ' + (this.name.middle || '') + ' ' + (this.name.last || ''))
            .replace("  ", " ");
    })
    .set(function (v) {
        let t = v.split(" ");

        this.name.first = t[0];
        if (t[2]) {
            this.name.middle = t[1];
            this.name.last = t[2];
        } else this.name.last = t[1];
    });

export const UserModel = model("User", userSchema);