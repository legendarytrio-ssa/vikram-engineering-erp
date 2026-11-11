import { Router } from "express";

import clientRoutes from "./clientRoutes.js";
import tenderRoutes from "./tenderRoutes.js";
import { getProjects } from "../controllers/projectController.js";

const router = Router();

router.use("/clients", clientRoutes);
router.use("/tenders", tenderRoutes);
router.get("/projects", getProjects);

export default router;