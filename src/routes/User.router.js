import { Router } from "express";

import { authenticate } from "../services/Auth.service";
import { createUser, updateUser } from "../services/User.service";

const router = Router();

router.post("/user", createUser);
router.put("/user", authenticate, updateUser);

export default router;
