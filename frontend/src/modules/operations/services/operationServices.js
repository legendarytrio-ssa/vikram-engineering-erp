import operationsApi from "../api/operations_api";

export const fetchActiveProjects = async () => {
  const response = await operationsApi.get("/projects");

  if (!response.data.success) {
    throw new Error("Unable to fetch active projects.");
  }

  return response.data.data || [];
}; 