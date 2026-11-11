
import operationsApi from "../api/operations_Api.js";



// --------------------------------------------------
// 1. Fetch Active Projects
// --------------------------------------------------

export const fetchActiveProjects = async () => {
  const response = await operationsApi.get("/projects");

  if (!response.data.success) {
    throw new Error("Unable to fetch active projects.");
  }

  return response.data.data || [];
};

// --------------------------------------------------
// 2. Fetch Individual Project Details
// --------------------------------------------------

export const fetchProjectDetails = async (projectId) => {
  if (!projectId) {
    throw new Error("Project ID is required.");
  }

  const response = await operationsApi.get(`/projects/${projectId}`);

  if (!response.data.success) {
    throw new Error("Unable to fetch project details.");
  }

  return response.data.data;
};


/**
 * Delete an entire Purchase Order.
 */
export const deletePurchaseOrder = async (projectId, poId) => {
  const response = await operationsApi.delete(
    `/projects/${projectId}/purchase-orders/${poId}`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Unable to delete Purchase Order."
    );
  }

  return response.data;
};

/**
 * Delete an individual document from a Purchase Order.
 */
export const deletePurchaseOrderDocument = async (
  projectId,
  poId,
  documentId
) => {
  const response = await operationsApi.delete(
    `/projects/${projectId}/purchase-orders/${poId}/documents/${documentId}`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Unable to delete document."
    );
  }

  return response.data;
};


// --------------------------------------------------
// 3. Purchase Order Document URL
// --------------------------------------------------

export const getPurchaseOrderDocumentUrl = (
  projectId,
  purchaseOrderId,
  documentId,
  disposition = "attachment"
) => {
  if (!projectId || !purchaseOrderId || !documentId) {
    throw new Error("Project, purchase order and document IDs are required.");
  }

  return operationsApi.getUri({
    url: `/projects/${projectId}/purchase-orders/${purchaseOrderId}/documents/${documentId}`,
    params: { disposition },
  });
};


// --------------------------------------------------
// 4. QC Report Document URL
// --------------------------------------------------

export const getQCReportDocumentUrl = (
  projectId,
  reportId,
  documentId,
  disposition = "attachment"
) => {
  if (!projectId || !reportId || !documentId) {
    throw new Error("Project, QC report and document IDs are required.");
  }

  return operationsApi.getUri({
    url: `/projects/${projectId}/qc-reports/${reportId}/documents/${documentId}`,
    params: { disposition },
  });
};


// --------------------------------------------------
// 5. Fetch Individual QC Report
// --------------------------------------------------

export const fetchQCReport = async (projectId, reportId) => {
  if (!projectId || !reportId) {
    throw new Error("Project ID and QC Report ID are required.");
  }

  const response = await operationsApi.get(
    `/projects/${projectId}/qc-reports/${reportId}`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Unable to fetch QC Report."
    );
  }

  return response.data.data;
};


// --------------------------------------------------
// 6. Update QC Report
// --------------------------------------------------

export const updateQCReport = async (
  projectId,
  reportId,
  formData
) => {
  if (!projectId || !reportId) {
    throw new Error("Project ID and QC Report ID are required.");
  }

  const response = await operationsApi.put(
    `/projects/${projectId}/qc-reports/${reportId}`,
    formData
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Unable to update QC Report."
    );
  }

  return response.data.data;
};


// --------------------------------------------------
// 7. Delete Entire QC Report
// --------------------------------------------------

export const deleteQCReport = async (projectId, reportId) => {
  if (!projectId || !reportId) {
    throw new Error("Project ID and QC Report ID are required.");
  }

  const response = await operationsApi.delete(
    `/projects/${projectId}/qc-reports/${reportId}`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Unable to delete QC Report."
    );
  }

  return response.data;
};


// --------------------------------------------------
// 8. Delete Individual QC Report Document
// --------------------------------------------------

export const deleteQCReportDocument = async (
  projectId,
  reportId,
  documentId
) => {
  if (!projectId || !reportId || !documentId) {
    throw new Error(
      "Project, QC Report and document IDs are required."
    );
  }

  const response = await operationsApi.delete(
    `/projects/${projectId}/qc-reports/${reportId}/documents/${documentId}`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Unable to delete QC Report document."
    );
  }

  return response.data.data;
};


export const getSalesDocumentUrl = async (
  projectId,
  documentId,
  disposition = "inline"
) => {
  const response = await operationsApi.get(
    `/projects/${projectId}/sales-documents/${documentId}/url`,
    {
      params: { disposition },
    }
  );

  return response.data.data.url;
};