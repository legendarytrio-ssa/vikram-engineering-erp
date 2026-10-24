import Client from "../models/clients.js";

export const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching clients." });
  }
};

export const createClients = async (req, res) => {
  const { companyName, ceos, contactEmail, phone, address, notes } = req.body;

  try {
    const client = await Client.findOneAndUpdate(
      { companyName },
      {
        $addToSet: { ceos: { $each: ceos } },
        contactEmail,
        phone,
        address,
        notes,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ error: "Failed to save client." });
  }
};