
import express from "express";
import multer from "multer";

import {
  getOperationsProjects,
  getProjectVault,
  submitPurchaseOrder,
  uploadQCDocument,
  uploadPurchaseDocument,
  getPurchaseOrderDocument,
} from "../controllers/operationsController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

// @route   GET /api/operations/projects
router.get("/projects", getOperationsProjects);

// @route   GET /api/operations/projects/:id
router.get("/projects/:id", getProjectVault);

// @route   POST /api/operations/projects/:id/purchase-orders
router.post(
  "/projects/:id/purchase-orders",
  upload.array("documents"),
  submitPurchaseOrder
);

// @route   GET /api/operations/projects/:id/purchase-orders/:poId/documents/:documentId
router.get(
  "/projects/:id/purchase-orders/:poId/documents/:documentId",
  getPurchaseOrderDocument
);

// @route   POST /api/operations/projects/:id/documents/qc
router.post(
  "/projects/:id/documents/qc",
  upload.array("documents"),
  uploadQCDocument
);

// @route   POST /api/operations/projects/:id/documents/purchase
router.post(
  "/projects/:id/documents/purchase",
  upload.array("documents"),
  uploadPurchaseDocument
);

export default router;
