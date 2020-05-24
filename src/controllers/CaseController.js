import CaseModel from "../models/CaseModel";
import PatientModel from "../models/PatientModel";
import FollowUpModel from "../models/FollowUpModel";
import { create500, create400 } from "../modules/httpErrors";
import moment from "moment";
import { getPatientColor } from "../utils";

export function create(req, res) {
  let _case = new CaseModel(req.body);
  _case.patient = req.patient._id;

  validateAndSave(res, _case);
}

export const get = (req, res) => res.json(req.patient.toObject());

export function update(req, res) {
  let _case = req.patient.case;
  if (!_case || !_case._id)
    return create400(res, "Can't update as no case exist for this patient");
  let updates = req.body;

  for (var attr in updates) _case[attr] = updates[attr];

  validateAndSave(res, _case);
}

export async function createFollowUp(req, res) {
  let _case = req.patient.case;
  let now = moment(new Date());
  now = now.year() + now.dayOfYear();
  _case.followUps.forEach((followUp) => {
    let f = moment(followUp.createdAt);
    if (now == f.year() + f.dayOfYear())
      return create500(res, "Followup for today exist!");
  });
  let followUp = new FollowUpModel(req.body);

  let err = await followUp.validate();
  if (err) return create400(res, err);

  _case.followUps.push(followUp._id);
  await _case.save();

  await followUp.save();
  res.json(followUp.toObject());
}

export function updateFollowUp(req, res) {
  FollowUpModel.findByIdAndUpdate(req.params.followUpId, req.body, {
    new: true,
  })
    .then((followUp) => res.send(followUp.toObject()))
    .catch((err) => create500(res, err, "Failed to update followup"));
}

function validateAndSave(res, _case) {
  _case.validate((err) => {
    if (err) return create400(res, err);

    _case
      .save()
      .then((_case) => res.json(_case.toObject()))
      .catch((err) => create500(res, err));
  });
}

export function getFollowUpsMinimal(req, res) {
  PatientModel.find({
    addedBy: req.user._id,
  })
    .populate({
      path: "case",
      populate: { path: "followUps", select: "nextFollowUpDate" },
      select: "followUps",
    })
    .select("case name")
    .then((patients) => {
      let data = {};

      patients.forEach((patient) => {
        patient = patient.toObject();
        patient.case &&
          patient.case.followUps.forEach((ev) => {
            if (!ev.nextFollowUpDate) return;

            let name = patient.fullname;
            let color = getPatientColor(patient._id);
            let date = moment(ev.nextFollowUpDate);

            if (!data[date.format("YYYY-MM-DD")])
              data[date.format("YYYY-MM-DD")] = [];

            data[date.format("YYYY-MM-DD")].push({
              _id: patient._id,
              followUpId: ev._id,
              date: date.format("YYYY-MM-DD"),
              start: date.format("YYYY-MM-DD hh:mm"),
              end: date.endOf("day").format("YYYY-MM-DD hh:mm"),
              name,
              color,
            });
          });
      });

      res.json(data);
    })
    .catch((err) => {
      create500(res, err);
    });
}
