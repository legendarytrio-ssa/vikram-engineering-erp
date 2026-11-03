import { Router } from "express";
import {
  getTenders,
  createTenders,
} from "../controllers/tenderController.js";

const router = Router();

router.get("/getTenders", getTenders);
router.post("/createTenders", createTenders);

export default router;