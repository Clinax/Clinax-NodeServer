import { create400 } from "@pranavraut033/js-utils/utils/httpErrors";
import Case from "../models/Case";
import Patient from "../models/Patient";

import { validateAndSave } from "../controllers/Case.controller";

export function createCase(req, res) {
  const _case = new Case(req.body);
  _case.patient = req.patient._id;

  validateAndSave(res, _case);
}

export const getCase = (req, res) => res.json(req.patient.toObject());

export function updateCase(req, res) {
  const _case = req.patient.case;
  if (!_case || !_case._id)
    return create400(res, "Can't update as no case exist for this patient");

  const updates = req.body;

  Object.assign(_case, updates);

  Patient.findByIdAndUpdate(req.patient._id, {
    updatedAt: new Date(),
  });

  validateAndSave(res, _case);
}
