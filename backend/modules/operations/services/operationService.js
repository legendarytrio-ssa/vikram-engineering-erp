import Project from "../../../models/Project.js";
import { getDownloadUrl, getViewUrl, uploadFilesToTigris } from "../../../utils/tigrisHelper.js";
import QualityControl from "../models/QualityControl.js";
import ItemPurchase from "../models/ItemPurchase.js";
import mongoose from "mongoose";

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


// Generate a View or Download URL for a purchase order document
export const fetchPurchaseOrderDocumentUrl = async (
  projectId,
  purchaseOrderId,
  documentId,
  disposition = "attachment"
) => {
  // Find the PO belonging to this project
  const purchaseOrder = await ItemPurchase.findOne({
    _id: purchaseOrderId,
    project: projectId,
  }).select("documents");

  if (!purchaseOrder) {
    return null;
  }

  // Find the requested document inside the PO
  const document = purchaseOrder.documents.id(documentId);

  if (!document) {
    return null;
  }

  // Generate the appropriate signed URL
  if (disposition === "inline") {
    return getViewUrl(document.key, document.originalName);
  }

  return getDownloadUrl(document.key, document.originalName);
};

//Create a Quality Control report
export const createQCReport = async({
  projectId,
  vendorName,
  title,
  description,
  customFields,
  files,
  createdBy
})=>{
    // Validate project ID.
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID.");
  }
  // Ensure the project exists.
  const project = await Project.findById(projectId);

  if(!project){
    throw new Error("Project not found");
  }

    // Upload supporting documents to Tigris.
  const uploadedDocuments = files?.length
    ? await uploadFilesToTigris(
        files,
        `projects/${projectId}/qc-reports`
      )
    : [];

    // Create QC report.
  const qcReport = await QualityControl.create({
    project: projectId,
    vendorName: vendorName?.trim() || "",
    title: title.trim(),
    description: description.trim(),
    customFields: customFields || [],
    docs: uploadedDocuments,
    createdBy,
  });

    return qcReport;


}


// Generate a View or Download URL for a QC report document
export const fetchQCReportDocumentUrl = async (
  projectId,
  reportId,
  documentId,
  disposition = "attachment"
) => {
  // Find the QC report belonging to this project
  const report = await QualityControl.findOne({
    _id: reportId,
    project: projectId,
  }).select("docs");

  if (!report) {
    return null;
  }

  // Find the requested document inside the QC report
  const document = report.docs.id(documentId);

  if (!document) {
    return null;
  }

  // Generate the appropriate signed Tigris URL
  if (disposition === "inline") {
    return getViewUrl(document.key, document.originalName);
  }

  return getDownloadUrl(document.key, document.originalName);
};

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



// // Forward this Specific PO of a Project to Finance Department
// export const forwardPOToFinance = async (projectId, poId) => {
//   const po = await ItemPurchase.findOne({ _id: poId, project: projectId });
//   if (!po) return null;

//   po.sentToFinance = true;
//   if (!po.sentToFinanceAt) po.sentToFinanceAt = new Date();
//   po.financeStatus = po.financeStatus || "DUE";
//   po.status = "INVOICE_APPROVED";

//   await po.save();
//   return po;
// };