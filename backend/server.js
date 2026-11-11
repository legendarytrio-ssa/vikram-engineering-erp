import "dotenv/config";

import express from "express";
import cors from "cors";
import dns from "dns";
import { connectDB } from "./config/mongoDB.js";

// Department routes
import salesRoutes from "./modules/sales/routes/index.js";
import financeRoutes from "./modules/finance/routes/financeRoutes.js";
// Adjust the path to match where you placed the operations folder 
// (e.g., "./modules/operations/routes/operationsRoutes.js" if you put it inside modules)
import operationsRoutes from "./modules/operations/routes/operationsRoutes.js"; 
import projectRoutes from "./routes/projectRoutes.js"
import Project from "./models/Project.js";
import { createChatRouter } from "./utils/chat-kit/index.js";

dns.setServers(["1.1.1.1", "0.0.0.0"]);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize MongoDB
connectDB();

// =======================
// SALES DEPARTMENT ROUTES
// =======================
app.use("/api/sales", salesRoutes);

// =======================
// OPERATIONS DEPARTMENT ROUTES
// =======================
app.use("/api/operations", operationsRoutes);

/// ======================
/// FINANCE DEPARTMENT ROUTES
/// ======================
app.use("/api/finance", financeRoutes);

/// ======================
/// Project ROUTES
/// ======================
app.use("/api", projectRoutes);

// =======================
// PROJECT CHAT ROUTES
// =======================
if (process.env.STREAM_API_KEY && process.env.STREAM_API_SECRET) {
  app.use(
    "/api/chat",
    createChatRouter({
      apiKey: process.env.STREAM_API_KEY,
      apiSecret: process.env.STREAM_API_SECRET,
      roomIdPrefix: "project",
      async getRoomMeta({ roomId }) {
        const projectCode = String(roomId ?? "").trim().toUpperCase();
        const project = await Project.findOne({ projectCode })
          .select("projectCode")
          .lean();

        if (!project) {
          const error = new Error("Project not found");
          error.status = 404;
          throw error;
        }

        return { name: project.projectCode };
      },
    })
  );
} else {
  console.warn("Stream Chat disabled: STREAM_API_KEY / STREAM_API_SECRET not set");
}

// =======================
// BACKEND TESTING
// =======================
app.get("/", (req, res) => {
  res.send("API working");
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Mongoose validation errors should be 400 Bad Request
  const statusCode = err.name === 'ValidationError' ? 400 : 500;
  res.status(statusCode).json({ 
    error: err.message || "Internal Server Error" 
  });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});