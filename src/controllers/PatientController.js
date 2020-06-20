import fs from "fs";

import PatientModel from "../models/PatientModel";
import { create404, create500, create400 } from "../modules/httpErrors";
import { getExtension } from "../modules/file";
import { stringToRegex } from "../modules/regex";
import CaseModel from "../models/CaseModel";
import { getDistinct } from "../modules/list";
import { compressToUTF16 } from "lz-string";

export function create(req, res) {
  if (!req.files) req.files = {};

  var patient = req.body,
    avatarFile = req.files.avatar;
  patient.addedBy = req.user._id;
  var patient = new PatientModel(patient);

  if (avatarFile) {
    let path = `${APP_ROOT}/uploads/img/${patient._id}`;
    fs.mkdir(path, () => {});
    let ext = getExtension(avatarFile.name);

    patient.avatar = `${patient._id}/${avatarFile.md5}.${ext}`;
    avatarFile.mv(`${path}/${avatarFile.md5}.jpg`);
  }

  let _case = new CaseModel({});
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

    let path = `${APP_ROOT}/uploads/img/${patient._id}`;
    fs.mkdir(path, () => {});

    patient.avatar = `${patient._id}/${avatar.md5}.jpg`;
    avatar.mv(`${path}/${avatar.md5}.jpg`);
  }

  if (updates) for (var attr in req.body.updates) patient[attr] = updates[attr];

  validateAndSave(res, patient);
}

export function getAll(req, res) {
  PatientModel.find({ addedBy: req.user._id })
    .then((patients) => res.send(patients.map((ev) => ev.toObject())))
    .catch((err) => create500(res, "Failed to retrive patients details", err));
}

function _delete(req, res) {
  PatientModel.deleteOne({ id: req.params.patientId, addedBy: req.user._id })
    .then((result) => res.send(result))
    .catch((err) => create400(res, "Failed to delete patient", err));
}
export { _delete as delete };

export function search(req, res) {
  let regex = stringToRegex(req.params.key);

  if (!regex) return res.json([]);

  regex = { $regex: regex };
  let query = PatientModel.find({
    $or: [
      { "name.first": regex },
      { "name.middle": regex },
      { "name.last": regex },
      { email: regex },
      { phone: regex },
      { "address.street": regex },
      { "address.area": regex },
      { "case.followUps.chiefComplain": regex },
    ],
  });

  if (req.queryParams.minimal == "true")
    query.select("name email case.followUps.chiefComplain");
  else
    query.populate({
      path: "case",
      select: "followUps",
      populate: { path: "followUps", select: "chiefComplain" },
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

export function getAreas(req, res) {
  PatientModel.find({
    addedBy: req.user._id,
  })
    .select("address")
    .then((patients) => {
      let areas = getDistinct(
        patients.map((ev) => ev.address && ev.address.area)
      ).filter((ev) => !!ev);
      res.send(areas);
    })
    .catch((err) => create500(res, "Failed to retrive areas", err));
}

/**
 * Function find patient and add patient object to incoming request
 */
export function getPatient(req, res, next) {
  PatientModel.findOne({
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
  PatientModel.findOne({
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
