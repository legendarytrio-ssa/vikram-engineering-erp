import { Router } from "express";
import { createStaff, getStaff } from "../controllers/staffController.js";
import { createExpense, getExpenses, getExpenseSummary } from "../controllers/expenseController.js";
import { 
  getOrGeneratePayroll, 
  togglePayrollStatus, 
  getPayrollSummary, 
  bulkPayPayroll 
} from "../controllers/payrollController.js";
import { searchInactiveStaff, toggleStaffStatus } from "../controllers/staffController.js";
const router = Router();

// Staff
router.post("/staff", createStaff);
router.get("/staff", getStaff);
router.get("/staff/inactive", searchInactiveStaff);
router.put("/staff/:id/status", toggleStaffStatus);

// Expenses
router.post("/expenses", createExpense);
router.get("/expenses", getExpenses);
router.get("/expenses/summary", getExpenseSummary); 

// Payroll
router.post("/payroll/generate", getOrGeneratePayroll);
router.get("/payroll/summary", getPayrollSummary); 
router.put("/payroll/bulk-pay", bulkPayPayroll); 
router.put("/payroll/:id/status", togglePayrollStatus); 

export default router;