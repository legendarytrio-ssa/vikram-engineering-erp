import Tender from "../models/tenders.js";

export const getTenders = async (req, res) => {
  try {
    const tenders = await Tender.find().sort({ createdAt: -1 });
    res.json(tenders);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching tenders." });
  }
};

export const createTenders = async (req, res) => {
  try {
    const tender = new Tender(req.body);
    const savedTender = await tender.save();
    res.status(201).json(savedTender);
  } catch (error) {
    res.status(400).json({ error: "Failed to save tender." });
  }
};