import moment from "moment-timezone";
import Patient from "../models/Patient";
import Appointment from "../models/Appointment";

import { create } from "./CaseController";
import { isValidObjectId } from "mongoose";
import { getPatientColor } from "../utils";
import { compressToUTF16 } from "lz-string";
import { create500 } from "../utils/httpErrors";

export function addAppointment(req, res) {
  let entry = new Appointment(req.body);

  entry.user = req.user._id;

  entry
    .save()
    .then(() => res.send("ok"))
    .catch((err) => create500(res, err));
}

export function updateAppointment(req, res) {
  if (!isValidObjectId(req.params.appointmentId))
    return create400(res, "Update failed", new Error("Invalid appointment id"));

  Appointment.findByIdAndUpdate(req.params.appointmentId, req.body.updates, {
    new: true,
  })
    .then((appointment) => res.json(appointment.toObject()))
    .catch((err) => create500(res, err));
}

export function deleteAppointment(req, res) {
  Appointment.deleteOne({ _id: req.params.appointmentId })
    .then(() => res.json("ok"))
    .catch((err) => create500(res, err));
}

export function getAppointments(req, res) {
  Appointment.find({
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
  let patients = await Patient.find({ addedBy: req.user._id })
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
        let date = moment(ev.nextFollowUpDate).tz(req.headers.timezone);

        let key = date.format("YYYY-MM-DD");

        if (!data[key]) data[key] = [];

        if (!data[key].find((e) => patient._id == e._id))
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

  let appointments = await Appointment.find({
    user: req.user._id,
  }).populate({ path: "patient", select: "name" });

  appointments.forEach((appointment) => {
    if (!appointment.dateTime) return;

    let date = moment(appointment.dateTime).tz(req.headers.timezone);
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

  delete data["Invalid date"];

  res.json({ compressedData: String(compressToUTF16(JSON.stringify(data))) });
}
