import Project from "../../../models/Project.js";
import { uploadFilesToTigris } from "../../../utils/tigrisHelper.js";
import QualityControl from "../models/QualityControl.js";
import ItemPurchase from "../models/ItemPurchase.js";

/**
 * Fetches all active projects for Operations Dashboards.
 */

export const fetchActiveProjects = async()=>{
    const projects = await Project.find({status : 'ACTIVE'})
        .populate("client","clientName")
        .populate("tender","tenderTitle")
        .select("-salesData.contractValue");

    return projects;
}

/**
 * Fetches a single project workspace (Vault) by its ID.
 */
export const fetchProjectVault = async (projectId) => {
  const project = await Project.findById(projectId)
    .populate("client", "clientName contactPerson")
    .populate("tender", "tenderTitle tenderRef")
    .populate("qualityRecords") // Populates the virtual we defined
    .populate("purchaseItems"); // Populates the virtual we defined
    
  return project;
};

/**
 * Creates a new structured Purchase Order linked to a Project, including file uploads.
 */

export const createPurchaseOrder = async(projectId, formData, files, userId)=>{
  const { materialName, vendorName, quantity, uom, unitRate } = formData;

  // 1. Calculate the total cost securely on the backend
  const totalCost = Number(quantity) * Number(unitRate);
  // 2. Upload files to Tigris (if any exist in the req.files array)
  const folderPath = `projects/${projectId}/purchaseOrders`;
  const uploadedDocuments = await uploadFilesToTigris(files, folderPath);

  // 3. Create the new ItemPurchase document
  const newPO = new ItemPurchase({
    project: projectId,
    materialName,
    vendorName,
    quantity,
    uom,
    unitRate,
    totalCost,
    status: "PO_ISSUED",
    createdBy: userId,
    documents: uploadedDocuments
  })

  await newPO.save();
  return newPO;
}

/**
 * (Pending) Adds independent documents to the QC Vault array
 */
export const addQCDocumentToProject = async (projectId, files) => {
  // Logic to upload to Tigris and $push to operationsData.qcDocuments
};

/**
 * (Pending) Adds independent documents to the Purchase Vault array
 */
export const addPurchaseDocumentToProject = async (projectId, files) => {
  // Logic to upload to Tigris and $push to operationsData.purchaseDocuments
};