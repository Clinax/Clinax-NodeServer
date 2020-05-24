import { Router } from "express";

import { authenticate } from "../controllers/AuthController";
import { getFollowUpsMinimal } from "../controllers/CaseController";
import { search } from "../controllers/PatientController";
import * as UserController from "../controllers/UserController";

const router = Router();

router.post("/user", UserController.create);
router.put("/user", authenticate, UserController.update);

router.get("/search/:key", authenticate, search);

router.get("/followUp/events", authenticate, getFollowUpsMinimal);
export default router;
