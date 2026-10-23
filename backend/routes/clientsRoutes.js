import { Router } from "express";
import Client from '../models/clients.js';

const router = Router();

router.get("/getClients", async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching clients." });
  }
})

router.post("/createClients", async (req, res) => {
  const { companyName, ceos, contactEmail, phone, address, notes } = req.body;

  try {
    // Upsert logic: Find by company name. If exists, update. If not, create.
    const client = await Client.findOneAndUpdate(
      { companyName: companyName },
      { 
        $addToSet: { ceos: { $each: ceos } }, // Only adds unique CEOs
        contactEmail, 
        phone, 
        address, 
        notes 
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ error: "Failed to save client." });
  }
})

export default router;