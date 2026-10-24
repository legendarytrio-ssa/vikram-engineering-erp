import { Router } from "express";
import {
  getClients,
  createClients,
} from "../controllers/clientController.js";

const router = Router();

router.get("/getClients", getClients);
router.post("/createClients", createClients);

export default router;