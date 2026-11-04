import { wrapAsync } from "../../../shared/wrapAsync";
import * as operationService from "../services/operationService.js"

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