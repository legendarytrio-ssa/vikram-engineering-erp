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
