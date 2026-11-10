import { Router } from "express";
import Project from "../models/Project.js";
import { uploadProjectFiles } from "../controller/projectController.js";
import { upload } from "../config/upload.js";

const router = Router();

router.post("/projects/:id/files", upload.fields([{ name: "projectDocs", maxCount: 10 }]), uploadProjectFiles);

export default router;