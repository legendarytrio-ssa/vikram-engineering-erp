import mongoose from "mongoose";
import Tender from "../models/Tender.js";
import Client from "../models/Client.js";
import { uploadFilesToTigris, deleteFileFromTigris, getDownloadUrl } from "../../../utils/tigrisHelper.js";

export const getTenders = async (req, res) => {
  try {
    const tenders = await Tender.find()
      .sort({ createdAt: -1 })
      .populate("client");

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
    // Note: 'others' is removed from this destructuring so we can parse it safely below
    const { code, title, category, description, client, status } = req.body;
    
    // 1. Parse 'others' from a string back into an object
    let others = req.body.others;
    if (typeof others === "string") {
      try {
        others = JSON.parse(others);
      } catch (err) {
        return res.status(400).json({
          error: "Invalid JSON format in the 'others' field.",
        });
      }
    }

    // 2. Validate required fields
    if (!code?.trim() || !title?.trim() || !category || !client) {
      return res.status(400).json({
        error: "Required fields: code, title, category, client.",
      });
    }

    // 3. Validate category
    if (!["GOVT", "PVT"].includes(category)) {
      return res.status(400).json({
        error: "Invalid category. Allowed values: GOVT, PVT.",
      });
    }

    // 4. Validate status if provided
    const allowedStatuses = ["PENDING", "APPLIED", "LIVE", "REJECTED"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}.`,
      });
    }

    // 5. Validate MongoDB ObjectIds
    if (!mongoose.isValidObjectId(client)) {
      return res.status(400).json({
        error: "Invalid client ID.",
      });
    }

    // 6. Check whether the client exists
    const existingClient = await Client.findById(client);
    if (!existingClient) {
      return res.status(404).json({
        error: "Client not found. Please select a valid client or create a client.",
      });
    }

    // 7. Normalize and check tender code uniqueness
    const normalizedCode = code.trim().toUpperCase();
    const duplicateTender = await Tender.findOne({ code: normalizedCode });
    if (duplicateTender) {
      return res.status(409).json({
        error: "A tender with this code already exists.",
      });
    }

    // 8. Handle file uploads concurrently
    const tenderFiles = req.files?.tenderDocs || [];
    const applicationFiles = req.files?.applicationDocs || [];

    const [tenderDocsMetadata, applicationDocsMetadata] = await Promise.all([
      uploadFilesToTigris(tenderFiles, `tenders/${normalizedCode}/tenderDocs`),
      uploadFilesToTigris(applicationFiles, `tenders/${normalizedCode}/applicationDocs`),
    ]);

    // 9. Create the tender (now passing the parsed 'others' object)
    const tender = new Tender({
      code: normalizedCode,
      title: title.trim(),
      category,
      description,
      client,
      tenderDocs: tenderDocsMetadata,
      applicationDocs: applicationDocsMetadata,
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

export const addTenderFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const tenderFiles = req.files?.tenderDocs || [];
    
    if (tenderFiles.length === 0) {
      return res.status(400).json({ error: "No files provided." });
    }

    const tender = await Tender.findById(id);
    if (!tender) return res.status(404).json({ error: "Tender not found." });

    const newDocs = await uploadFilesToTigris(tenderFiles, `tenders/${tender.code}/tenderDocs`);

    const updatedTender = await Tender.findByIdAndUpdate(
      id,
      { $push: { tenderDocs: { $each: newDocs } } },
      { new: true }
    ).populate("client");

    return res.status(200).json(updatedTender);
  } catch (error) {
    res.status(500).json({ error: "Failed to add files." });
  }
};

export const deleteTenderFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileKey } = req.body;

    if (!fileKey) return res.status(400).json({ error: "File key required." });

    // 1. Delete from Tigris S3
    await deleteFileFromTigris(fileKey);

    // 2. Remove from MongoDB array
    const updatedTender = await Tender.findByIdAndUpdate(
      id,
      { $pull: { tenderDocs: { key: fileKey }, applicationDocs: { key: fileKey } } },
      { new: true }
    ).populate("client");

    return res.status(200).json(updatedTender);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete file." });
  }
};

export const getTenderFileUrl = async (req, res) => {
  try {
    const { fileKey, originalName } = req.query;
    
    if (!fileKey || !originalName) {
      return res.status(400).json({ error: "fileKey and originalName are required." });
    }

    const downloadUrl = await getDownloadUrl(fileKey, originalName);
    return res.status(200).json({ url: downloadUrl });
  } catch (error) {
    console.error("Download link error:", error);
    res.status(500).json({ error: "Failed to generate secure download link." });
  }
};