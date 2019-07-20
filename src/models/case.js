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
    physiqueGeneral: {
      type: String,
      trim: true
    },
    femaleComplaint: {
      type: String
    },
    onExamination: {
      eyes: {
        type: String,
        trim: true
      },
      throat: {
        type: String,
        trim: true
      },
      nose: {
        type: String,
        trim: true
      },
      chest: {
        type: String,
        trim: true
      },
      perAbdomin: {
        type: String,
        trim: true
      },
      BP: {
        type: String,
        trim: true
      },
      weight: {
        type: String,
        trim: true
      },
      pulse: {
        type: String,
        trim: true
      },
      cvs: {
        type: String,
        trim: true
      },
      cns: {
        type: String,
        trim: true
      },
      skin: {
        type: String,
        trim: true
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
    treatment: {
      medicine: {
        drug: {
          type: String,
          trim: true
        },
        potency: {
          type: String,
          trim: true
        }
      },
      otherDetails: String
    },
    followUps: [FollowUp]
  },
  {
    timestamps: true
  }
);

export default CaseSchema;
