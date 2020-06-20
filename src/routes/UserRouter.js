import { Router } from "express";

import { authenticate } from "../controllers/AuthController";
import { search } from "../controllers/PatientController";
import * as UserController from "../controllers/UserController";

const router = Router();

router.post("/user", UserController.create);
router.put("/user", authenticate, UserController.update);

router.get("/search/:key", authenticate, search);

router.get(
  "/followUp/events",
  authenticate,
  UserController.getFollowUpsMinimal
);

router.post("/appointment", authenticate, UserController.addAppointment);

export default router;
