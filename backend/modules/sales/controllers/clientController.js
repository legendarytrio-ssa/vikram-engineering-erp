import Client from "../models/Client.js";
import { deleteFileFromTigris, getDownloadUrl, uploadFilesToTigris } from "../../../utils/tigrisHelper.js";

// GET /api/clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};

// GET /api/clients/:id
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch client" });
  }
};

export const createClient = async (req, res) => {
  try {
    const { name, type, contactNo, organisationCEO } = req.body;
    let others = req.body.others;

    // 1. Parse 'others' string back into an object
    if (typeof others === "string") {
      try {
        others = JSON.parse(others);
      } catch (e) {
        others = {};
      }
    }

    if (!name || !type || !contactNo) {
      return res.status(400).json({ error: "Name, type, and contactNo are required" });
    }

    // 2. Extract and Upload files intercepted by Multer
    const clientFiles = req.files?.clientDocs || [];
    const safeFolderName = name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    
    // Assumes req.user exists. If not, omit the creatorId from the helper params
    const creatorId = req.user?._id || undefined; 
    const uploadedDocs = await uploadFilesToTigris(clientFiles, `clients/${safeFolderName}`, creatorId);

    // 3. Save to MongoDB
    const newClient = new Client({
      name,
      type,
      contactNo,
      organisationCEO,
      clientDocs: uploadedDocs,
      others,
    });

    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to create client" });
  }
};

export const addClientFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const clientFiles = req.files?.clientDocs || [];

    if (clientFiles.length === 0) {
      return res.status(400).json({ error: "No files provided." });
    }

    const client = await Client.findById(id);
    if (!client) return res.status(404).json({ error: "Client not found." });

    const safeFolderName = client.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const newDocs = await uploadFilesToTigris(clientFiles, `clients/${safeFolderName}`);

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { $push: { clientDocs: { $each: newDocs } } },
      { new: true }
    );

    return res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({ error: "Failed to add client files." });
  }
};

export const deleteClientFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileKey } = req.body;

    if (!fileKey) return res.status(400).json({ error: "File key required." });

    await deleteFileFromTigris(fileKey);

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { $pull: { clientDocs: { key: fileKey } } },
      { new: true }
    );

    return res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete client file." });
  }
};

export const getClientFileUrl = async (req, res) => {
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