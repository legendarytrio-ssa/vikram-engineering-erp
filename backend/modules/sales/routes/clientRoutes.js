import { Router } from "express";
import {
  getAllClients,
  createClient,
  getClientById,
  addClientFiles,
  deleteClientFile,
  getClientFileUrl
} from "../controllers/clientController.js";

import { upload } from "../../../config/upload.js";

const router = Router();

router.get("/getAllClients", getAllClients);
router.post("/createClient", upload.fields([{ name: "clientDocs", maxCount: 5 }]), createClient);
router.post("/getClientById", getClientById);

router.post("/:id/files", upload.fields([{ name: "clientDocs", maxCount: 10 }]), addClientFiles);
router.delete("/:id/files", deleteClientFile);
// Add this route
router.get("/download-file", getClientFileUrl);

export default router;