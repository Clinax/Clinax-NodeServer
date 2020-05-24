import { Router } from "express";
import * as PatientController from "../controllers/PatientController";
import { authenticate } from "../controllers/AuthController";
let router = Router();

router.get("/patient", authenticate, PatientController.getAll);
router.post("/patient", authenticate, PatientController.create);
router.get("/patient/areas", authenticate, PatientController.getAreas);

router.get(
  "/patient/:patientId",
  authenticate,
  PatientController.getPatient,
  PatientController.get
);
router.put(
  "/patient/:patientId",
  authenticate,
  PatientController.getPatient,
  PatientController.update
);
router.delete("/patient/:patientId", authenticate, PatientController.delete);

export default router;
