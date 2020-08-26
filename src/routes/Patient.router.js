import { Router } from "express";
import { authenticate } from "../services/Auth.service";
import {
  getPatinets,
  createPatient,
  getAutofillData,
  searchPatient,
  findPatient,
  getPatient,
  updatePatinet,
  deletePatient,
} from "../services/Patient.service";

const router = Router();

router.get("/patient", authenticate, getPatinets);
router.post("/patient", authenticate, createPatient);
router.get("/patient/options", authenticate, getAutofillData);

router.get("/search", authenticate, searchPatient);

router.get("/patient/:patientId", authenticate, findPatient, getPatient);
router.put("/patient/:patientId", authenticate, getPatient, updatePatinet);

router.delete("/patient/:patientId", authenticate, deletePatient);

export default router;
