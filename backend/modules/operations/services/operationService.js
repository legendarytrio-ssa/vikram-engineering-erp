import Project from "../../../models/Project";

/**
 * Fetches all active projects for Operations Dashboards.
 */

export const fetchActiveProjects = async()=>{
    const projects = await Project.find({status : 'ACTIVE'})
        .populate("client","clientName")
        .populate("tender","tenderTitle")
        .select("-salesData,contractValue");

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