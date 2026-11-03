import { Router } from "express";
import {
  getTenders,
  createTenders,
} from "../controllers/tenderController.js";
import { upload } from "../../../config/upload.js";

const router = Router();

router.get("/getTenders", getTenders);
router.post("/createTenders", 
    upload.fields([
    { name: "tenderDocs", maxCount: 10 },
    { name: "applicationDocs", maxCount: 10 },
  ]), createTenders);

export default router;