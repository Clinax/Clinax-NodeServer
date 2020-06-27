import { Router } from "express";

import { authenticate } from "../controllers/AuthController";
import * as UserController from "../controllers/UserController";

const router = Router();

router.post("/user", UserController.create);
router.put("/user", authenticate, UserController.update);

export default router;
