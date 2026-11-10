
import express from "express";
import multer from "multer";

import {
  getOperationsProjects,
  getProjectVault,

  // Purchase Order controllers
  submitPurchaseOrder,
  getPurchaseOrder,
  editPurchaseOrder,
  deletePurchaseOrderDocument,
  removePurchaseOrder,
  getPurchaseOrderDocument,

  // QC Report controllers
  uploadQCDocument,
  submitQCReport,
  getQCReport,
  editQCReport,
  deleteQCReportDocument,
  removeQCReport,
  getQCReportDocument,

  // Other document controllers
  uploadPurchaseDocument,
} from "../controllers/operationsController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

// --------------------------------------------------
// PROJECT ROUTES
// --------------------------------------------------

router.get("/projects", getOperationsProjects);

router.get("/projects/:id", getProjectVault);

// --------------------------------------------------
// PURCHASE ORDER ROUTES
// --------------------------------------------------

// Create Purchase Order
router.post(
  "/projects/:id/purchase-orders",
  upload.array("documents"),
  submitPurchaseOrder
);

// Get Purchase Order
router.get(
  "/projects/:id/purchase-orders/:poId",
  getPurchaseOrder
);

// Update Purchase Order
router.put(
  "/projects/:id/purchase-orders/:poId",
  upload.array("documents"),
  editPurchaseOrder
);

// Delete individual Purchase Order document
router.delete(
  "/projects/:id/purchase-orders/:poId/documents/:documentId",
  deletePurchaseOrderDocument
);

// Delete entire Purchase Order
router.delete(
  "/projects/:id/purchase-orders/:poId",
  removePurchaseOrder
);

// Get Purchase Order document
router.get(
  "/projects/:id/purchase-orders/:poId/documents/:documentId",
  getPurchaseOrderDocument
);

// --------------------------------------------------
// QC REPORT ROUTES
// --------------------------------------------------

// Create QC Report
router.post(
  "/projects/:id/qc-reports",
  upload.array("documents"),
  submitQCReport
);

// Get individual QC Report
router.get(
  "/projects/:id/qc-reports/:reportId",
  getQCReport
);

// Update QC Report
router.put(
  "/projects/:id/qc-reports/:reportId",
  upload.array("documents"),
  editQCReport
);

// Delete individual QC Report document
router.delete(
  "/projects/:id/qc-reports/:reportId/documents/:documentId",
  deleteQCReportDocument
);

// Delete entire QC Report
router.delete(
  "/projects/:id/qc-reports/:reportId",
  removeQCReport
);

// Get QC Report document
router.get(
  "/projects/:id/qc-reports/:reportId/documents/:documentId",
  getQCReportDocument
);

// --------------------------------------------------
// OTHER DOCUMENT ROUTES
// --------------------------------------------------

// Upload independent QC documents
router.post(
  "/projects/:id/documents/qc",
  upload.array("documents"),
  uploadQCDocument
);

// Upload independent Purchase documents
router.post(
  "/projects/:id/documents/purchase",
  upload.array("documents"),
  uploadPurchaseDocument
);

// --------------------------------------------------
// FINANCE ROUTES (currently disabled)
// --------------------------------------------------

// router.put(
//   "/projects/:id/purchase-orders/:poId/send-to-finance",
//   sendPurchaseOrderToFinance
// );

export default router;
