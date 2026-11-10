import Project from "../../../models/Project.js";
import { getDownloadUrl, getViewUrl, uploadFilesToTigris ,deleteFileFromTigris} from "../../../utils/tigrisHelper.js";
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


/**
 * Delete a specific document from a Purchase Order.
 */
export const deletePurchaseOrderDocument = async (
  projectId,
  poId,
  documentId
) => {
  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(poId) ||
    !mongoose.Types.ObjectId.isValid(documentId)
  ) {
    throw new Error("Invalid project, purchase order, or document ID.");
  }

  const purchaseOrder = await ItemPurchase.findOne({
    _id: poId,
    project: projectId,
  });

  if (!purchaseOrder) {
    return null;
  }

  const document = purchaseOrder.documents.id(documentId);

  if (!document) {
    return null;
  }

  // Delete the actual file from Tigris first
  await deleteFileFromTigris(document.key);

  // Remove the attachment metadata from MongoDB
  purchaseOrder.documents.pull({ _id: documentId });

  await purchaseOrder.save();

  return purchaseOrder;
};

/**
 * Delete a Purchase Order and all its associated documents.
 */
export const deletePurchaseOrder = async (projectId, poId) => {
  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(poId)
  ) {
    throw new Error("Invalid project or purchase order ID.");
  }

  const purchaseOrder = await ItemPurchase.findOne({
    _id: poId,
    project: projectId,
  });

  if (!purchaseOrder) {
    return null;
  }

  // Delete all associated files from Tigris
  for (const document of purchaseOrder.documents) {
    await deleteFileFromTigris(document.key);
  }

  // Delete the Purchase Order from MongoDB
  await ItemPurchase.deleteOne({
    _id: poId,
    project: projectId,
  });

  return purchaseOrder;
};


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

/**
 * Fetch a specific Purchase Order belonging to a project.
 */
export const fetchPurchaseOrder = async (projectId, poId) => {
  const purchaseOrder = await ItemPurchase.findOne({
    _id: poId,
    project: projectId,
  });

  return purchaseOrder;
};

/**
 * Update an existing Purchase Order.
 * Newly uploaded documents are appended to existing documents.
 */
export const updatePurchaseOrder = async (
  projectId,
  poId,
  formData,
  files = []
) => {
  const purchaseOrder = await ItemPurchase.findOne({
    _id: poId,
    project: projectId,
  });

  if (!purchaseOrder) {
    return null;
  }

  const {
    materialName,
    vendorName,
    quantity,
    uom,
    unitRate,
  } = formData;

  const parsedQuantity = Number(quantity);
  const parsedUnitRate = Number(unitRate);

  if (
    !materialName?.trim() ||
    !vendorName?.trim() ||
    !uom?.trim() ||
    !Number.isFinite(parsedQuantity) ||
    parsedQuantity <= 0 ||
    !Number.isFinite(parsedUnitRate) ||
    parsedUnitRate < 0
  ) {
    throw new Error("Invalid Purchase Order details.");
  }

  // Update Purchase Order fields
  purchaseOrder.materialName = materialName.trim();
  purchaseOrder.vendorName = vendorName.trim();
  purchaseOrder.quantity = parsedQuantity;
  purchaseOrder.uom = uom.trim();
  purchaseOrder.unitRate = parsedUnitRate;

  // Recalculate total cost on the backend
  purchaseOrder.totalCost = parsedQuantity * parsedUnitRate;

  // Upload and append new documents, if provided
  if (files.length > 0) {
    const uploadedDocuments = await uploadFilesToTigris(
      files,
      `projects/${projectId}/purchaseOrders`
    );

    purchaseOrder.documents.push(...uploadedDocuments);
  }

  await purchaseOrder.save();

  return purchaseOrder;
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


/**
 * Fetch a specific QC Report belonging to a project.
 */
export const fetchQCReport = async (projectId, reportId) => {
  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(reportId)
  ) {
    throw new Error("Invalid project or QC report ID.");
  }

  const report = await QualityControl.findOne({
    _id: reportId,
    project: projectId,
  });

  return report;
};


/**
 * Update an existing QC Report.
 * Newly uploaded documents are appended to existing documents.
 */
export const updateQCReport = async (
  projectId,
  reportId,
  formData,
  files = []
) => {
  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(reportId)
  ) {
    throw new Error("Invalid project or QC report ID.");
  }

  const report = await QualityControl.findOne({
    _id: reportId,
    project: projectId,
  });

  if (!report) return null;

  const {
    vendorName,
    title,
    description,
    customFields,
  } = formData;

  if (!title?.trim() || !description?.trim()) {
    throw new Error("QC Report title and description are required.");
  }

  let parsedCustomFields = customFields || [];

  // FormData sends arrays as strings, so parse when necessary.
  if (typeof parsedCustomFields === "string") {
    try {
      parsedCustomFields = JSON.parse(parsedCustomFields);
    } catch {
      throw new Error("Invalid custom fields format.");
    }
  }

  if (!Array.isArray(parsedCustomFields)) {
    throw new Error("Custom fields must be an array.");
  }

  report.vendorName = vendorName?.trim() || "";
  report.title = title.trim();
  report.description = description.trim();

  report.customFields = parsedCustomFields.map((field) => ({
    name: String(field.name || "").trim(),
    value: String(field.value || "").trim(),
  }));

  if (
    report.customFields.some(
      (field) => !field.name || !field.value
    )
  ) {
    throw new Error("Every custom field must have a name and value.");
  }

  // Upload and append newly selected documents.
  if (files?.length) {
    const uploadedDocuments = await uploadFilesToTigris(
      files,
      `projects/${projectId}/qc-reports`
    );

    report.docs.push(...uploadedDocuments);
  }

  await report.save();

  return report;
};


/**
 * Delete an entire QC Report and all its Tigris documents.
 */
export const deleteQCReport = async (projectId, reportId) => {
  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(reportId)
  ) {
    throw new Error("Invalid project or QC report ID.");
  }

  const report = await QualityControl.findOne({
    _id: reportId,
    project: projectId,
  });

  if (!report) return null;

  // Delete all associated documents from Tigris.
  for (const document of report.docs || []) {
    if (document.key) {
      await deleteFileFromTigris(document.key);
    }
  }

  await report.deleteOne();

  return report;
};


/**
 * Delete one document from a QC Report.
 */
export const deleteQCReportDocument = async (
  projectId,
  reportId,
  documentId
) => {
  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(reportId) ||
    !mongoose.Types.ObjectId.isValid(documentId)
  ) {
    throw new Error("Invalid project, report or document ID.");
  }

  const report = await QualityControl.findOne({
    _id: reportId,
    project: projectId,
  });

  if (!report) return null;

  const document = report.docs.id(documentId);

  if (!document) return null;

  // Delete the actual file using its stored Tigris key.
  if (document.key) {
    await deleteFileFromTigris(document.key);
  }

  report.docs.pull(documentId);

  await report.save();

  return report;
};
