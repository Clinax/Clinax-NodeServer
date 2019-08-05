import FollowUp from "./followup.js";

const Schema = require("mongoose").Schema;

/**
 * Case Schema defination
 */
const CaseSchema = Schema(
  {
    chiefComplain: {
      type: String,
      trim: true,
      required: true
    },
    crietria: [{ name: String, value: String }],
    physiqueGeneral: {
      type: String,
      trim: true
    },
    femaleComplaint: {
      type: String
    },
    onExamination: {
      type: [{ name: String, value: String }],
      get(cc) {
        if (!cc) return [];
        let t = {};
        cc.forEach(a => {
          t[a.name] = a.value;
        });

        return t;
      },
      set(v) {
        let t = [];
        for (const key in v) t.push({ name: key, value: v[key] });
        return t;
      }
    },
    duringAcute: {
      type: String,
      trim: true
    },
    mind: {
      type: String,
      trim: true
    },
    extra: {
      type: { name: String, value: String },
      get(cc) {
        if (!cc) return [];

        let t = {};
        cc.forEach(a => (t[a.name] = a.value));
        return t;
      },
      set(v) {
        let t = [];
        for (const key in v) t.push({ name: key, value: v[key] });
        return t;
      }
    },
    treatment: {
      drugs: [String],
      otherDetails: String
    },
    followUps: [FollowUp]
  },
  {
    timestamps: true
  }
);

CaseSchema.set("toObject", { getters: true });

export default CaseSchema;
