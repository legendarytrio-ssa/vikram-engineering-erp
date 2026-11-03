import Client from "../models/clients.js";

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

// POST /api/clients
export const createClient = async (req, res) => {
  const { name, type, contactNo, organisationCEO, others } = req.body;

  // Basic required checks
  if (!name || !type || !contactNo) {
    return res.status(400).json({ error: "Name, type, and contactNo are required" });
  }

  try {
    const newClient = new Client({
      name,
      type,
      contactNo,
      organisationCEO,
      others,
    });

    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to create client" });
  }
};