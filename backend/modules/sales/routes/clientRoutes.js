import { Router } from "express";
import {
  getAllClients,
  createClient,
  getClientById
} from "../controllers/clientController.js";

import { upload } from "../../../config/upload.js";

const router = Router();

router.get("/getAllClients", getAllClients);
router.post("/createClient", upload.fields([{ name: "clientDocs", maxCount: 5 }]), createClient);
router.post("/getClientById", getClientById);

export default router;