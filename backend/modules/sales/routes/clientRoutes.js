import { Router } from "express";
import {
  getAllClients,
  getClientById,
  createClient,
} from "../controllers/clientController.js";

const router = Router();

router.get("/getClients", getAllClients);
router.get("/getClientById", getClientById);
router.post("/createClients", createClient);

export default router;