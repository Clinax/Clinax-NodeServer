import { Router } from "express";
import * as AuthController from "../controllers/AuthController";

const router = Router();

router.post("/login", AuthController.login);

router.get("/self", AuthController.authenticate, AuthController.self);

export default router;
