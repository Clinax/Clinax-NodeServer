import { Router } from "express";
import { getCase, updateCase, createCase } from "../services/Case.service";
import { findPatient, getPatientWithCase } from "../services/Patient.service";
import { authenticate } from "../services/Auth.service";
import { createFollowUp, updateFollowUp } from "../services/Followup.service";

const router = Router();

router.get("/case/:patientId", authenticate, getPatientWithCase, getCase);
router.put("/case/:patientId", authenticate, getPatientWithCase, updateCase);
router.post("/case/:patientId", authenticate, findPatient, createCase);

router.post(
  "/followUp/:patientId",
  authenticate,
  getPatientWithCase,
  createFollowUp
);
router.put("/followUp/:followUpId", authenticate, updateFollowUp);

export default router;
