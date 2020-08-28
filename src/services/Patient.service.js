import fs from "fs";

import { compressToUTF16 } from "lz-string";
import { getExtension } from "@pranavraut033/js-utils/utils/file";
import { stringToRegex } from "@pranavraut033/js-utils/utils/regex";
import {
  create404,
  create500,
  create400,
} from "@pranavraut033/js-utils/utils/httpErrors";
import Case from "../models/Case";
import Patient from "../models/Patient";
import FollowUp from "../models/FollowUp";

import { validateAndSave } from "../controllers/Patient.controller";
import { getDistinctProp as _getDistinctProp } from "../utils";

export function createPatient(req, res) {
  if (!req.files) req.files = {};

  let patient = req.body;
  const avatarFile = req.files.avatar;
  patient.addedBy = req.user._id;

  patient = new Patient(patient);

  if (avatarFile) {
    const path = `${global.APP_ROOT}/uploads/img/${patient._id}`;
    fs.mkdir(path, () => {});
    const ext = getExtension(avatarFile.name);

    patient.avatar = `${patient._id}/${avatarFile.md5}.${ext}`;
    avatarFile.mv(`${path}/${avatarFile.md5}.jpg`);
  }

  const _case = new Case({});
  _case.patient = patient._id;
  _case.save();

  validateAndSave(res, patient);
}

export const getPatient = (req, res) => res.json(req.patient.toObject());

export function updatePatinet(req, res) {
  const { patient } = req;

  let { updates } = req.body;
  const avatar = req.files && req.files.avatar;

  if (avatar) {
    updates = updates && JSON.parse(updates);

    const path = `${global.APP_ROOT}/uploads/img/${patient._id}`;
    fs.mkdir(path, () => {});

    patient.avatar = `${patient._id}/${avatar.md5}.jpg`;
    avatar.mv(`${path}/${avatar.md5}.jpg`);
  }

  if (updates) Object.assign(patient, req.body.updates);

  validateAndSave(res, patient);
}

export function getPatinets(req, res) {
  Patient.find({ addedBy: req.user._id })
    .populate({
      path: "case",
      populate: { path: "followUps", select: "treatment.diagnosis createdAt" },
      select: "followUps",
    })
    .then((patients) =>
      res.send(
        patients.map((_patient) => {
          const patient = _patient.toObject();
          const temp = patient.case.followUps
            .filter((followUp) => followUp.treatment)
            .map((followUp) => ({
              diagnosis: followUp.treatment.diagnosis,
              createdAt: followUp.createdAt,
            }));

          if (temp && temp.length) {
            patient.diagnosis = temp[temp.length - 1].diagnosis;
            patient.diagnosedAt = temp[temp.length - 1].createdAt;
            patient.diagnoses = {};

            temp.forEach((e) => {
              const a = patient.diagnoses[e.diagnosis];
              patient.diagnoses[e.diagnosis] =
                a && a < e.createdAt ? a : e.createdAt;
            });
          }

          patient.case = patient.case._id;
          return patient;
        })
      )
    )
    .catch((err) => create500(res, "Failed to retrive patients details", err));
}

export function deletePatient(req, res) {
  Patient.deleteOne({ _id: req.params.patientId, addedBy: req.user._id })
    .then((result) => res.send(result))
    .catch((err) => create400(res, "Failed to delete patient", err));
}

export async function searchPatient(req, res) {
  let regex = stringToRegex(req.queryParams.search);

  if (!regex) return res.json([]);

  regex = { $regex: regex };

  const queries = [
    { "name.first": regex },
    { "name.middle": regex },
    { "name.last": regex },
    { email: regex },
    { phone: regex },
    { "address.street": regex },
    { "address.area": regex },
  ];

  if (req.queryParams.minimal !== "true") {
    const follows = await FollowUp.find({
      $or: [{ chiefComplain: regex }, { "treatment.diagnosis": regex }],
    }).select("_id");
    const cases = await Case.find({
      followUps: { $in: follows.map((ev) => ev._id) },
    }).select("patient");

    queries.push({
      _id: { $in: cases.map((ev) => ev.patient) },
    });
  }

  const query = Patient.find({ $or: queries });

  if (req.queryParams.minimal === "true") query.select("name email");
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

export function getAutofillData(req, res) {
  Patient.find({ addedBy: req.user._id })
    .select("address occupation")
    .then((patients) => {
      const getDistinctProp = _getDistinctProp.bind(null, patients);

      const areas = getDistinctProp((ev) => ev.address && ev.address.area);
      const pins = getDistinctProp((ev) => ev.address && ev.address.pincode);
      const occupations = getDistinctProp((ev) => ev.occupation);

      res.send({ pins, areas, occupations });
    })
    .catch((err) => create500(res, "Failed to retrive areas", err));
}

/**
 * Function find patient and add patient object to incoming request
 */
export function findPatient(req, res, next) {
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
