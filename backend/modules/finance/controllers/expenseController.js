import Expense from "../models/Expense.js";
import { wrapAsync } from "../../../shared/wrapAsync.js";

export const createExpense = wrapAsync(async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.status(201).json(expense);
});

export const getExpenses = wrapAsync(async (req, res) => {
  const { date } = req.query;
  let filter = {};
  
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    filter.date = { $gte: startOfDay, $lte: endOfDay };
  }
  
  const expenses = await Expense.find(filter).sort({ date: -1 });
  res.status(200).json(expenses);
});

export const getExpenseSummary = wrapAsync(async (req, res) => {
  const { date, view } = req.query; // view = 'DAILY' or 'MONTHLY'
  const targetDate = date ? new Date(date) : new Date();
  
  let start, end;
  if (view === "MONTHLY") {
    start = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), 1));
    end = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth() + 1, 0, 23, 59, 59, 999));
  } else {
    start = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate()));
    end = new Date(start);
    end.setUTCHours(23, 59, 59, 999);
  }

  const result = await Expense.aggregate([
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } }
  ]);

  const summary = result.length > 0 ? { totalAmount: result[0].totalAmount, count: result[0].count } : { totalAmount: 0, count: 0 };
  res.status(200).json(summary);
});

export const updateExpense = wrapAsync(async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!expense) return res.status(404).json({ error: "Expense not found" });
  res.status(200).json(expense);
});

export const deleteExpense = wrapAsync(async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });
  res.status(200).json({ message: "Expense deleted successfully" });
});