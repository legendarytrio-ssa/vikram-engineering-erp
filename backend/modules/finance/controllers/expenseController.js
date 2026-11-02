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