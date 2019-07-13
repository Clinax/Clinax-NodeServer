import { PatientModel } from "../models/patient";

export function search(req, res) {
  let keyword = req.params.keyword.split(" ");
  PatientModel.find({
    name: keyword,
    email: keyword
  });
}
