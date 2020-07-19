import fs from "fs";

import Case from "../models/Case";
import Patient from "../models/Patient";
import FollowUp from "../models/FollowUp";

import { compressToUTF16 } from "lz-string";
import { getDistinct } from "../utils/list";
import { getExtension } from "../utils/file";
import { stringToRegex } from "../utils/regex";
import { create404, create500, create400 } from "../utils/httpErrors";

export function create(req, res) {
  if (!req.files) req.files = {};

  var patient = req.body,
    avatarFile = req.files.avatar;
  patient.addedBy = req.user._id;

  patient = new Patient(patient);

  if (avatarFile) {
    let path = `${global.APP_ROOT}/uploads/img/${patient._id}`;
    fs.mkdir(path, () => {});
    let ext = getExtension(avatarFile.name);

    patient.avatar = `${patient._id}/${avatarFile.md5}.${ext}`;
    avatarFile.mv(`${path}/${avatarFile.md5}.jpg`);
  }

  let _case = new Case({});
  _case.patient = patient._id;
  _case.save();

  validateAndSave(res, patient);
}

export const get = (req, res) => res.json(req.patient.toObject());

export function update(req, res) {
  let patient = req.patient;

  var updates = req.body.updates,
    avatar = req.files && req.files.avatar;

  if (avatar) {
    updates = updates && JSON.parse(updates);

    let path = `${global.APP_ROOT}/uploads/img/${patient._id}`;
    fs.mkdir(path, () => {});

    patient.avatar = `${patient._id}/${avatar.md5}.jpg`;
    avatar.mv(`${path}/${avatar.md5}.jpg`);
  }

  if (updates) for (var attr in req.body.updates) patient[attr] = updates[attr];

  validateAndSave(res, patient);
}

export function getAll(req, res) {
  Patient.find({ addedBy: req.user._id })
    .populate({
      path: "case",
      populate: { path: "followUps", select: "treatment.diagnosis createdAt" },
      select: "followUps",
    })
    .then((patients) =>
      res.send(
        patients.map((ev) => {
          ev = ev.toObject();
          let temp = ev.case.followUps
            .map(
              (ev) =>
                ev.treatment && {
                  diagnosis: ev.treatment.diagnosis,
                  createdAt: ev.createdAt,
                }
            )
            .filter((ev) => !!ev);

          if (temp && temp.length) {
            ev.diagnosis = temp[temp.length - 1].diagnosis;
            ev.diagnosedAt = temp[temp.length - 1].createdAt;
            ev.diagnoses = {};
            temp.forEach((e) => {
              let a = ev.diagnoses[e.diagnosis];
              ev.diagnoses[e.diagnosis] =
                a && a < e.createdAt ? a : e.createdAt;
            });
          }

          ev.case = ev.case._id;
          return ev;
        })
      )
    )
    .catch((err) => create500(res, "Failed to retrive patients details", err));
}

function _delete(req, res) {
  Patient.deleteOne({ _id: req.params.patientId, addedBy: req.user._id })
    .then((result) => res.send(result))
    .catch((err) => create400(res, "Failed to delete patient", err));
}
export { _delete as delete };

export async function search(req, res) {
  let regex = stringToRegex(req.queryParams.search);

  if (!regex) return res.json([]);

  regex = { $regex: regex };

  let queries = [
    { "name.first": regex },
    { "name.middle": regex },
    { "name.last": regex },
    { email: regex },
    { phone: regex },
    { "address.street": regex },
    { "address.area": regex },
  ];

  if (req.queryParams.minimal != "true") {
    let follows = await FollowUp.find({
      $or: [{ chiefComplain: regex }, { "treatment.diagnosis": regex }],
    }).select("_id");
    let cases = await Case.find({
      followUps: { $in: follows.map((ev) => ev._id) },
    }).select("patient");

    queries.push({
      _id: { $in: cases.map((ev) => ev.patient) },
    });
  }

  let query = Patient.find({ $or: queries });

  if (req.queryParams.minimal == "true") query.select("name email");
  else
    query.populate({
      path: "case",
      select: "followUps",
      populate: {
        path: "followUps",
        select: "chiefComplain treatment.diagnosis",
      },
    });

  query
    .then((patients) =>
      res.json({
        compressedData: compressToUTF16(
          JSON.stringify(patients.map((ev) => ev.toObject()))
        ),
      })
    )
    .catch((err) => create500(res, err));
}

export function getOptions(req, res) {
  Patient.find({ addedBy: req.user._id })
    .select("address occupation")
    .then((patients) => {
      let areas = getDistinct(
        patients.map((ev) => ev.address && ev.address.area)
      ).filter((ev) => !!ev);
      let pins = getDistinct(
        patients.map((ev) => ev.address && ev.address.pincode)
      ).filter((ev) => !!ev);
      let occupations = getDistinct(patients.map((ev) => ev.occupation)).filter(
        (ev) => !!ev
      );

      res.send({ pins, areas, occupations });
    })
    .catch((err) => create500(res, "Failed to retrive areas", err));
}

/**
 * Function find patient and add patient object to incoming request
 */
export function getPatient(req, res, next) {
  Patient.findOne({
    _id: req.params.patientId,
    addedBy: req.user._id,
  })
    .then((patient) => {
      if (!patient) return create404(res, `Patient doesn't exist!`);

      req.patient = patient;
      next();
    })
    .catch((err) => create500(res, `Failed to retrive patient`, err));
}

/**
 * Function find patient and add patient object to incoming request;
 * Also populate case and followUps
 */
export function getPatientWithCase(req, res, next) {
  Patient.findOne({
    _id: req.params.patientId,
    addedBy: req.user._id,
  })
    .populate({ path: "case", populate: "followUps", select: "+followUps" })
    .then((patient) => {
      if (!patient) return create404(res, `Patient doesn't exist!`);

      req.patient = patient;
      next();
    })
    .catch((err) => create500(res, `Failed to retrive patient`, err));
}

function validateAndSave(res, patient) {
  patient.validate((err) => {
    if (err) return create400(res, err);

    patient
      .save()
      .then((patient) => res.json(patient.toObject()))
      .catch((err) => create500(res, err));
  });
}
