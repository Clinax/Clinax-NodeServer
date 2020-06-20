import CaseModel from "../models/CaseModel";
import FollowUpModel from "../models/FollowUpModel";
import { create500, create400 } from "../modules/httpErrors";
import moment from "moment";

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
