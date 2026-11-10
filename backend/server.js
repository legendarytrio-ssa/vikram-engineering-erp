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