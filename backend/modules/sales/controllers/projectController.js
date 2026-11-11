import Project from "../../../models/Project.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "ACTIVE" })
      .sort({ createdAt: -1 })
      .select("projectCode projectName status client tender createdAt")
      .populate("client", "name type")
      .populate("tender", "title code")
      .lean();

    return res.status(200).json(projects);
  } catch (error) {
    console.error("Fetch projects error:", error);

    return res.status(500).json({
      error: "Server error fetching projects.",
    });
  }
};
