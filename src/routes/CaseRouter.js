import { Router } from "express";
import * as CaseController from "../controllers/CaseController";
import {
  getPatient,
  getPatientWithCase,
} from "../controllers/PatientController";
import { authenticate } from "../controllers/AuthController";

let router = Router();

router.get(
  "/case/:patientId",
  authenticate,
  getPatientWithCase,
  CaseController.get
);
router.put(
  "/case/:patientId",
  authenticate,
  getPatientWithCase,
  CaseController.update
);
router.post(
  "/case/:patientId",
  authenticate,
  getPatient,
  CaseController.create
);
router.post(
  "/followUp/:patientId",
  authenticate,
  getPatientWithCase,
  CaseController.createFollowUp
);
router.put(
  "/followUp/:followUpId",
  authenticate,
  CaseController.updateFollowUp
);
export default router;
