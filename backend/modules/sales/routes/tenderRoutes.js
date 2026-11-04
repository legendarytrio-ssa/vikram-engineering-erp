import { Router } from "express";
import {
  getTenders,
  createTenders,
  addTenderFiles,
  deleteTenderFile,
  getTenderFileUrl,
} from "../controllers/tenderController.js";
import { upload } from "../../../config/upload.js";

const router = Router();

router.get("/getTenders", getTenders);
router.post("/createTenders", 
    upload.fields([
    { name: "tenderDocs", maxCount: 10 },
    { name: "applicationDocs", maxCount: 10 },
  ]), createTenders);

router.post("/:id/files", upload.fields([{ name: "tenderDocs", maxCount: 10 }]), addTenderFiles);
router.delete("/:id/files", deleteTenderFile);
router.get("/download-file", getTenderFileUrl);

export default router;