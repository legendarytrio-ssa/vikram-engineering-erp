import LedgerEntry from "../models/LedgerEntry.js";
import { wrapAsync } from "../../../shared/wrapAsync.js";

const calculateRunningBalance = (entries) => {
  let currentBalance = 0; 
  return entries.map(entry => {
    if (entry.type === "CREDIT") currentBalance += entry.amount;
    if (entry.type === "DEBIT") currentBalance -= entry.amount;
    return { ...entry.toObject(), runningBalance: currentBalance };
  });
};

export const getProjectLedger = wrapAsync(async (req, res) => {
  const entries = await LedgerEntry.find({ project: req.params.projectId })
    .populate("account.ref", "name empName companyName")
    .sort({ date: 1, createdAt: 1 });
  res.status(200).json(calculateRunningBalance(entries));
});

export const getEntityLedger = wrapAsync(async (req, res) => {
  const entries = await LedgerEntry.find({ 
    "account.model": req.params.model, 
    "account.ref": req.params.entityId 
  }).populate("project", "projectCode projectName").sort({ date: 1, createdAt: 1 });
  res.status(200).json(calculateRunningBalance(entries));
});