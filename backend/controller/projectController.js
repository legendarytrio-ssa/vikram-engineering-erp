import Project from "../models/Project.js";
import { uploadFilesToTigris, deleteFileFromTigris, getDownloadUrl, getViewUrl } from "../utils/tigrisHelper.js";


// --- UPLOAD PROJECT FILES ---
export const uploadProjectFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetVault } = req.body; // e.g., "operationsData.qcDocuments"
    const files = req.files?.projectDocs || [];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files provided." });
    }

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: "Project not found." });

    // Upload to Tigris under a specific project folder
    // const uploaderId = req.user?._id || undefined;
    const uploadedDocs = await uploadFilesToTigris(files, `projects/${project.projectCode}/${targetVault}`);

    // Dynamically push the files into the correct department array (Sales, Ops, or Finance)
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $push: { [targetVault]: { $each: uploadedDocs } } },
      { new: true }
    );

    return res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Project file upload error:", error);
    return res.status(500).json({ error: "Failed to upload project files." });
  }
};