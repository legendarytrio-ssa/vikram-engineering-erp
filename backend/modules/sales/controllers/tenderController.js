// import Tender from "../models/tenders.js";

// export const getTenders = async (req, res) => {
//   try {
//     const tenders = await Tender.find().sort({ createdAt: -1 });
//     res.json(tenders);
//   } catch (error) {
//     res.status(500).json({ error: "Server error fetching tenders." });
//   }
// };

// export const createTenders = async (req, res) => {
//   try {
//     const tender = new Tender(req.body);
//     const savedTender = await tender.save();
//     res.status(201).json(savedTender);
//   } catch (error) {
//     res.status(400).json({ error: "Failed to save tender." });
//   }
// };


import mongoose from "mongoose";
import Tender from "../models/Tender.js";
import Client from "../models/clients.js";

export const getTenders = async (req, res) => {
  try {
    const tenders = await Tender.find()
      .sort({ createdAt: -1 })
      .populate("client")
      .populate("createdBy", "name email");

    return res.status(200).json(tenders);
  } catch (error) {
    console.error("Fetch tenders error:", error);

    return res.status(500).json({
      error: "Server error fetching tenders.",
    });
  }
};

export const createTenders = async (req, res) => {
  try {
    const {
      code,
      title,
      category,
      description,
      client,
      tenderDocs,
      applicationDocs,
      status,
      project,
      others,
    } = req.body;

    // 1. Validate required fields
    if (
      !code?.trim() ||
      !title?.trim() ||
      !category ||
      !client
    ) {
      return res.status(400).json({
        error:
          "Required fields: code, title, category, client, createdBy.",
      });
    }

    // 2. Validate category
    if (!["GOVT", "PVT"].includes(category)) {
      return res.status(400).json({
        error: "Invalid category. Allowed values: GOVT, PVT.",
      });
    }

    // 3. Validate status if provided
    const allowedStatuses = [
      "PENDING",
      "APPLIED",
      "LIVE",
      "REJECTED",
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}.`,
      });
    }

    // 4. Validate MongoDB ObjectIds
    if (
      !mongoose.isValidObjectId(client) ||
      !mongoose.isValidObjectId(createdBy)
    ) {
      return res.status(400).json({
        error: "Invalid client or createdBy ID.",
      });
    }

    if (project && !mongoose.isValidObjectId(project)) {
      return res.status(400).json({
        error: "Invalid project ID.",
      });
    }

    // 5. Check whether the client exists
    const existingClient = await Client.findById(client);

    if (!existingClient) {
      return res.status(404).json({
        error: "Client not found. Please select a valid client or create a client.",
      });
    }

    // 7. Normalize and check tender code uniqueness
    const normalizedCode = code.trim().toUpperCase();

    const duplicateTender = await Tender.findOne({
      code: normalizedCode,
    });

    if (duplicateTender) {
      return res.status(409).json({
        error: "A tender with this code already exists.",
      });
    }

    // 8. Prevent manually setting a project unless your workflow allows it
    if (project) {
      return res.status(400).json({
        error:
          "A project cannot be assigned during tender creation.",
      });
    }

    // 9. Create the tender
    const tender = new Tender({
      code: normalizedCode,
      title: title.trim(),
      category,
      description,
      client,
      tenderDocs,
      applicationDocs,
      status: "PENDING",
      others,
    });

    // 10. Validate all Mongoose schema constraints before saving
    await tender.validate();

    const savedTender = await tender.save();

    return res.status(201).json({
      message: "Tender created successfully.",
      tender: savedTender,
    });
  } catch (error) {
    console.error("Create tender error:", error);

    // Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Tender validation failed.",
        details: Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    // Duplicate key error (MongoDB unique index)
    if (error.code === 11000) {
      return res.status(409).json({
        error: "A tender with this code already exists.",
      });
    }

    // Invalid ObjectId cast
    if (error.name === "CastError") {
      return res.status(400).json({
        error: `Invalid value for field: ${error.path}.`,
      });
    }

    return res.status(500).json({
      error: "Server error while creating tender.",
    });
  }
};
