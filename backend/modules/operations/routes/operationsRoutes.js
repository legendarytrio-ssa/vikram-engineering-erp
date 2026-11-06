import express from "express";
import multer from "multer";

// Importing the exact function names from your updated controller
import { 
  getOperationsProjects, 
  getProjectVault, 
  submitPurchaseOrder,
  uploadQCDocument,
  uploadPurchaseDocument
} from "../controllers/operationsController.js"; 

const router = express.Router();

// Memory storage for Tigris uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

// GET /api/operations/projects
router.get("/projects", getOperationsProjects);

// GET /api/operations/projects/:id
router.get("/projects/:id", getProjectVault);

// POST /api/operations/projects/:id/purchase-orders
router.post(
  "/projects/:id/purchase-orders",
  upload.array("documents"), 
  submitPurchaseOrder
);

// POST /api/operations/projects/:id/documents/qc (Future logic)
router.post(
  "/projects/:id/documents/qc",
  upload.array("documents"),
  uploadQCDocument
);

// POST /api/operations/projects/:id/documents/purchase (Future logic)
router.post(
  "/projects/:id/documents/purchase",
  upload.array("documents"),
  uploadPurchaseDocument
);

export default router;