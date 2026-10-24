import { Router } from "express";

import clientRoutes from "./clientRoutes.js";
import tenderRoutes from "./tenderRoutes.js";

const router = Router();

router.use("/clients", clientRoutes);
router.use("/tenders", tenderRoutes);

export default router;