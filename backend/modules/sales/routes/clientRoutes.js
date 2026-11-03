import { Router } from "express";
import {
  getAllClients,
  createClient,
  getClientById
} from "../controllers/clientController.js";

const router = Router();

router.get("/getAllClients", getAllClients);
router.post("/createClient", createClient);
router.post("/getClientById", getClientById);

export default router;