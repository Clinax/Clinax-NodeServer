import { Router } from "express";

import { authenticate } from "../services/Auth.service";
import {
  addOrUpdateInventoryToDoEntry,
  deleteInventoryToDoEntry,
  getAll,
} from "../services/InventoryToDo.service";

const router = Router();

router.get("/inventory-todo", authenticate, getAll);
router.post("/inventory-todo", authenticate, addOrUpdateInventoryToDoEntry);
router.put("/inventory-todo", authenticate, addOrUpdateInventoryToDoEntry);

router.delete("/inventory-todo/:name", authenticate, deleteInventoryToDoEntry);

export default router;
