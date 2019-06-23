import CaseSchema from "./case.js";
import MetaSchema from "./meta.js";

import {
    model,
    Schema
} from "mongoose";

var patientSchema = Schema({
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
    phoneNumber: String,
    email: {
        type: String,
        lowercase: true
    },
    address: MetaSchema.addressSchema,
    age: {
        type: Number,
        min: 0,
        max: 110,
    },
    medicalNote: String,
    bloodGroup: {
        type: String,
        enum: MetaSchema.bloodGroups
    },
    emergencyContact: {
        name: String,
        phoneNumber: Number,
        email: String,
        relationShip: String
    },
    cases: [CaseSchema]
}, {
    timestamps: true
});

patientSchema.virtual('fullName')
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

export const PatientModel = model("Patient", patientSchema);