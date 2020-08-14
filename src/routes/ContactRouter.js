import { Router } from "express";

import { authenticate } from "../controllers/AuthController";
import * as ContactController from "../controllers/ContactController";

const router = Router();

router.get("/contacts", authenticate, ContactController.getContacts);

router.post("/contact", authenticate, ContactController.createContact);
router.put("/contact/:id", authenticate, ContactController.updateContact);

export default router;
