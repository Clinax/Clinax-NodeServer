import moment from "moment";
import Case from "../models/Case";
import Patient from "../models/Patient";
import FollowUp from "../models/FollowUp";

import { create500, create400 } from "../utils/httpErrors";

export function create(req, res) {
  let _case = new Case(req.body);
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

  Patient.findByIdAndUpdate(req.patient._id, {
    updatedAt: new Date(),
  });

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
  let followUp = new FollowUp(req.body);

  let err = await followUp.validate();
  if (err) return create400(res, err);

  _case.followUps.push(followUp._id);
  await _case.save();

  await followUp.save();

  await Patient.findByIdAndUpdate(req.queryParams.patientId, {
    updatedAt: new Date(),
  });

  res.json(followUp.toObject());
}

export function updateFollowUp(req, res) {
  FollowUp.findByIdAndUpdate(req.params.followUpId, req.body, {
    new: true,
  })
    .then(async (followUp) => {
      await Patient.findByIdAndUpdate(req.queryParams.patientId, {
        updatedAt: new Date(),
      });
      res.send(followUp.toObject());
    })
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
