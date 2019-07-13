const Schema = require("mongoose").Schema;

export default Schema(
  {
    medication: [
      {
        dose: Number, // in MG
        drug: String, // name of the drug
        afterMeal: Boolean // whether to eat after meal or before
      }
    ],
    conplaint: String, // patient given complain
    remark: String, // interpretation by the doctor
    nextFollowupDate: {
      type: Date,
      default: () => {
        return new Date().addDays(10);
      }
    }
  },
  {
    timestamps: true
  }
);
