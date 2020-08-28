import { Router } from "express";

import { authenticate } from "../services/Auth.service";
import {
  getContacts,
  createContact,
  updateContact,
} from "../services/Contact.service";

const router = Router();

router.get("/contacts", authenticate, getContacts);

router.post("/contact", authenticate, createContact);
router.put("/contact/:id", authenticate, updateContact);

export default router;
