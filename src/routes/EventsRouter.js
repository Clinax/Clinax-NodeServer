import { Router } from "express";

import { authenticate } from "../controllers/AuthController";
import * as EventController from "../controllers/EventController";

const router = Router();

router.post("/appointment", authenticate, EventController.addAppointment);
router.get("/appointments", authenticate, EventController.getAppointments);

router.get(
  "/followUp/events",
  authenticate,
  EventController.getFollowUpsMinimal
);

router.put(
  "/appointment/:appointmentId",
  authenticate,
  EventController.updateAppointment
);
router.delete(
  "/appointment/:appointmentId",
  authenticate,
  EventController.deleteAppointment
);
export default router;
