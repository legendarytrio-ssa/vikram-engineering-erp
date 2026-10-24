import "dotenv/config";

import express from "express";
import cors from "cors";
import dns from "dns";
import { connectDB } from "./config/mongoDB.js";

// Department routes
import salesRoutes from "./modules/sales/routes/index.js";

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

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});