import { Router } from "express";
import { login, authenticate, self } from "../services/Auth.service";

const router = Router();

router.post("/login", login);

router.get("/self", authenticate, self);

export default router;
