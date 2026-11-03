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