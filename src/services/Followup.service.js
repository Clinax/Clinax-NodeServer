import moment from "moment";
import { create500, create400 } from "@pranavraut033/js-utils/utils/httpErrors";
import Patient from "../models/Patient";
import FollowUp from "../models/FollowUp";

export async function createFollowUp(req, res) {
  const _case = req.patient.case;
  let now = moment(new Date());
  now = now.year() + now.dayOfYear();
  _case.followUps.forEach((followUp) => {
    const f = moment(followUp.createdAt);
    if (now === f.year() + f.dayOfYear())
      return create500(res, "Followup for today exist!");
  });
  const followUp = new FollowUp(req.body);

  const err = await followUp.validate();
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
