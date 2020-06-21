import moment from "moment";
import UserModel from "../models/UserModel";
import AppointmentModel from "../models/AppointmentModel";
import PatientModel from "../models/PatientModel";

import { compressToUTF16 } from "lz-string";
import { getPatientColor } from "../utils";
import { create500, create409, create400 } from "../modules/httpErrors";

export function create(req, res) {
  let user = req.body;

  new UserModel(user)
    .save()
    .then((user) => res.json(user.toObject()))
    .catch((err) => {
      if (err.name == "MongoError" && err.code == 11000) {
        create409(
          res,
          "User with " +
            (err.message.indexOf("username") != -1
              ? `username '${user.username}'`
              : `email '${user.email}'`) +
            " already exists.",
          err
        );
      } else create500(res, err);
    });
}

export function update(req, res) {
  for (var attr in req.body.updates) req.user[attr] = req.body.updates[attr];

  req.user
    .save()
    .then((user) => res.json(user))
    .catch((err) =>
      create400(
        res,
        `Failed to update user with id '${req.params.userId}'`,
        err
      )
    );
}

function _delete(req, res) {
  UserModel.deleteOne({ _id: req.parmas.id })
    .then((result) => res.json(result))
    .catch((err) => create500(res, err));
}

export { _delete as delete };

export function addAppointment(req, res) {
  let entry = new AppointmentModel(req.body);

  entry.user = req.user._id;

  entry
    .save()
    .then(() => res.send("ok"))
    .catch((err) => create500(res, err));
}
export function getAppointments(req, res) {
  AppointmentModel.find({
    user: req.user._id,
    dateTime: {
      $gte: moment(req.queryParams.from).startOf("day").toDate(),
      $lte: moment(req.queryParams.to).endOf("day").toDate(),
    },
  })
    .populate({ path: "patient", select: "name" })
    .then((entries) => res.json(entries.map((ev) => ev.toObject())))
    .catch((err) => create500(res, err));
}
export async function getFollowUpsMinimal(req, res) {
  let patients = await PatientModel.find({ addedBy: req.user._id })
    .populate({
      path: "case",
      populate: { path: "followUps", select: "nextFollowUpDate" },
      select: "followUps",
    })
    .select("case name");

  let data = {};

  patients.forEach((patient) => {
    patient = patient.toObject();
    patient.case &&
      patient.case.followUps.forEach((ev) => {
        if (!ev.nextFollowUpDate) return;

        let name = patient.fullname;
        let color = getPatientColor(patient._id);
        let date = moment(ev.nextFollowUpDate);

        let key = date.format("YYYY-MM-DD");

        if (!data[key]) data[key] = [];

        data[key].push({
          _id: patient._id,
          followUpId: ev._id,
          date: key,
          type: "follow-up",
          start: date.format("YYYY-MM-DD hh:mm"),
          end: date.endOf("day").format("YYYY-MM-DD hh:mm"),
          name,
          color,
        });
      });
  });

  let appointments = await AppointmentModel.find({
    user: req.user._id,
  }).populate({ path: "patient", select: "name" });

  appointments.forEach((appointment) => {
    let date = moment(appointment.dateTime);
    let key = date.format("YYYY-MM-DD");

    if (!data[key]) data[key] = [];

    let patient = appointment.patient;
    let name = (patient && patient.fullname) || appointment.name;
    let color = getPatientColor((patient && patient._id) || appointment.name);

    data[key].push({
      _id: patient && patient._id,
      name,
      color,
      date: key,
      type: "appointment",
      appointmentId: appointment._id,
      start: date.format("YYYY-MM-DD HH:mm"),
      end: date.add(1, "hours").format("YYYY-MM-DD HH:mm"),
      notes: appointment.notes,
    });
  });

  res.json({ compressedData: String(compressToUTF16(JSON.stringify(data))) });
}
