import { Router } from "express";

import { authenticate } from "../services/Auth.service";
import {
  addAppointment,
  getAppointments,
  getFollowUpsMinimal,
  updateAppointment,
  deleteAppointment,
} from "../services/Event.service";

const router = Router();

router.post("/appointment", authenticate, addAppointment);
router.get("/appointments", authenticate, getAppointments);

router.get("/followUp/events", authenticate, getFollowUpsMinimal);

router.put("/appointment/:appointmentId", authenticate, updateAppointment);
router.delete("/appointment/:appointmentId", authenticate, deleteAppointment);

export default router;
