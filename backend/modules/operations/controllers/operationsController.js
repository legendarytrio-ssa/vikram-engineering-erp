import { wrapAsync } from "../../../shared/wrapAsync.js";
import * as operationService from "../services/operationService.js";
import mongoose from "mongoose";


// @desc    Get all active projects for Operations Dashboards
// @route   GET /api/operations/projects
export const getOperationsProjects = wrapAsync(
    async (req, res, next) => {
        const projects = await operationService.fetchActiveProjects();
        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    }
)

// @desc    Get a single project for the Project Vault
// @route   GET /api/operations/projects/:id
export const getProjectVault = wrapAsync(async (req, res, next) => {
  const project = await operationService.fetchProjectVault(req.params.id);

  if (!project) {
    return res.status(404).json({ 
      success: false, 
      message: "Project not found" 
    });
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Create a new Purchase Order with Tigris document uploads
// @route   POST /api/operations/projects/:id/purchase-orders
export const submitPurchaseOrder = wrapAsync(
  async(req,res,next)=>{
    const projectId = req.params.id;
    const formData = req.body;
    const files = req.files;

    const dummyUserId = "60d5ecb54b1234567890abcd";

    const newPO = await operationService.createPurchaseOrder(projectId, formData, files, dummyUserId);

    res.status(201).json({
    success: true,
    message: "Purchase Order and documents successfully uploaded.",
    data: newPO
    });
  }
)

// @desc    Upload independent documents to the QC Project Vault
// @route   POST /api/operations/projects/:id/documents/qc
export const uploadQCDocument = wrapAsync(async (req, res, next) => {
  //logic i will write later

  res.status(200).json({
    success: true,
    message: "QC Document upload endpoint reached. Upload logic pending."
  });
});

// @desc    Upload independent documents to the Purchase Project Vault
// @route   POST /api/operations/projects/:id/documents/purchase
export const uploadPurchaseDocument = wrapAsync(async (req, res, next) => {
  //Logic I will write later

  res.status(200).json({
    success: true,
    message: "Purchase Document upload endpoint reached. Upload logic pending."
  });
});


export const getPurchaseOrderDocument = wrapAsync(async(req,res,next)=>{
    
  const {
    id:projectId,
    poId,
    documentId
  }= req.params;

  const disposition = req.query.disposition === "inline" ? "inline" : "attachment";

  const url = await operationService.fetchPurchaseOrderDocumentUrl(
    projectId,
    poId,
    documentId,
    disposition
  )

    if (!url) {
    return res.status(404).json({
      success: false,
      message: "Purchase order or document not found.",
    });
  }

  res.redirect(302, url);
});


export const submitQCReport = async (req, res) => {
  try {
    const { id: projectId } = req.params;

    const {
      vendorName,
      title,
      description,
      customFields,
    } = req.body;

    // Validate required fields.
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Report title is required.",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Report description is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    // Parse customFields because FormData sends it as a string.
    let parsedCustomFields = [];

    try {
      parsedCustomFields = customFields
        ? JSON.parse(customFields)
        : [];
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid custom parameters format.",
      });
    }

    if (!Array.isArray(parsedCustomFields)) {
      return res.status(400).json({
        success: false,
        message: "Custom parameters must be an array.",
      });
    }

    // Validate custom parameter entries.
    const invalidField = parsedCustomFields.some(
      (field) =>
        !field.name?.trim() || !field.value?.trim()
    );

    if (invalidField) {
      return res.status(400).json({
        success: false,
        message: "Every custom parameter must have a name and value.",
      });
    }

    // Get authenticated user.
    // const createdBy = req.user?._id || req.user?.id;

    // if (!createdBy) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Authenticated user information not found.",
    //   });
    // }

    const qcReport = await operationService.createQCReport({
      projectId,
      vendorName,
      title,
      description,
      customFields: parsedCustomFields,
      files: req.files || [],
      
    });

    return res.status(201).json({
      success: true,
      message: "QC report created successfully.",
      data: qcReport,
    });
  } catch (error) {
    console.error("Submit QC Report Error:", error);

    return res.status(
      error.message === "Project not found." ? 404 : 500
    ).json({
      success: false,
      message: error.message || "Unable to create QC report.",
    });
  }
};

export const getQCReportDocument = wrapAsync( async (req, res, next) => {
  try {
    const { id: projectId, reportId, documentId } = req.params;
    const disposition =
      req.query.disposition === "inline" ? "inline" : "attachment";

    const url = await operationService.fetchQCReportDocumentUrl(
      projectId,
      reportId,
      documentId,
      disposition
    );

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "QC report or document not found.",
      });
    }

    return res.redirect(url);
  } catch (error) {
    next(error);
  }
});