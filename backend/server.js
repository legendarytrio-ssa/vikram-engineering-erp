import 'dotenv/config';

import express from "express";
import cors from "cors";
import {connectDB} from './config/mongoDB.js';

import clientsRoutes from './routes/clientsRoutes.js'
import tenderRoutes from './routes/tenderRoutes.js'
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize MongoDB
connectDB();

// =======================
// CLIENT ROUTES
// =======================
app.use("/api/clients",clientsRoutes);


// =======================
// TENDER ROUTES
// =======================

// GET: Fetch all tenders for the homepage overview
app.use('/api/tenders',tenderRoutes)

// backend testing
app.get("/", (req, res) => {
  res.send("API working");
});

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is healthy"
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});