import mongoose from "mongoose";
import Tender from "../models/Tender.js";
import Client from "../models/Client.js";
import Project from "../../../models/Project.js";
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

// CEO Action: Approve Tender for Bidding
export const approveTender = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tender = await Tender.findById(id);
    if (!tender) return res.status(404).json({ error: "Tender not found." });
    if (tender.status !== "PENDING") {
      return res.status(400).json({ error: "Only PENDING tenders can be approved." });
    }

    // Changing to APPLIED indicates the CEO approved it and it is out for bidding
    tender.status = "APPLIED";
    const updatedTender = await tender.save();

    return res.status(200).json({ message: "Tender approved for bidding.", tender: updatedTender });
  } catch (error) {
    return res.status(500).json({ error: "Failed to approve tender." });
  }
};

// CEO Action: Discard/Reject Tender
export const rejectTender = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tender = await Tender.findById(id);
    if (!tender) return res.status(404).json({ error: "Tender not found." });
    
    tender.status = "REJECTED";
    const updatedTender = await tender.save();

    return res.status(200).json({ message: "Tender discarded.", tender: updatedTender });
  } catch (error) {
    return res.status(500).json({ error: "Failed to reject tender." });
  }
};

// CEO Action: Win Bid & Convert to Active Project
export const convertToProject = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    
    const tender = await Tender.findById(id).session(session);
    if (!tender) throw new Error("Tender not found.");
    if (tender.status !== "PO_ISSUED") throw new Error("Only tenders with an issued PO can be converted to Live Projects.");

    // 1. Generate new Project record matching the ProjectSchema
    const newProject = new Project({
      projectCode: `PRJ-${tender.code}`,
      projectName: tender.title,
      tender: tender._id,
      client: tender.client,
      status: "ACTIVE", 
      
      // Initialize the department vaults
      salesData: { documents: [] },
      operationsData: { qcDocuments: [], purchaseDocuments: [] },
      financeData: { documents: [] },
      
      // Preserve the tender category dynamically in the others Map
      others: { tenderCategory: tender.category }
    });

    const savedProject = await newProject.save({ session });

    // 2. Update Tender to LIVE
    tender.status = "LIVE";
    
    // If your Tender schema includes the project reference, uncomment the next line:
    // tender.project = savedProject._id; 
    
    await tender.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ 
      message: "Tender won! Project ID generated and isolated workspaces initialized.", 
      project: savedProject 
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        error: "Project validation failed.", 
        details: error.message 
      });
    }
    
    return res.status(400).json({ error: error.message || "Failed to convert tender to project." });
  }
};

// Sales Action: Upload PO Documents and change status to PO_ISSUED
export const markPoIssued = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tender = await Tender.findById(id);
    if (!tender) return res.status(404).json({ error: "Tender not found." });
    
    // Ensure the tender was actually approved by the CEO first
    if (tender.status !== "APPLIED") {
      return res.status(400).json({ error: "Only APPLIED tenders can receive a Purchase Order." });
    }

    const poFiles = req.files?.poDocs || [];
    if (poFiles.length === 0) {
      return res.status(400).json({ error: "Purchase Order documents are required." });
    }

    // Upload the PO files to a dedicated folder in Tigris
    const poDocsMetadata = await uploadFilesToTigris(poFiles, `tenders/${tender.code}/poDocs`);

    // Update state and attach files
    tender.status = "PO_ISSUED";
    tender.poDocs.push(...poDocsMetadata);
    
    const updatedTender = await tender.save();

    return res.status(200).json({ 
      message: "PO uploaded. Tender forwarded to CEO for project creation.", 
      tender: updatedTender 
    });
  } catch (error) {
    console.error("Mark PO Issued error:", error);
    return res.status(500).json({ error: "Failed to upload PO and update status." });
  }
};