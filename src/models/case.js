import FollowUp from "./followup.js"

const Schema = require('mongoose').Schema;

/*
    Case Schema definition
*/
const CaseSchema = Schema({
    conplain: {
        type: String,
        trim: true,
        required: true,
        maxLength: 256
    },
    isClosed: Boolean,
    followUps: [FollowUp]
}, {
    timestamps: true
})

export default CaseSchema;