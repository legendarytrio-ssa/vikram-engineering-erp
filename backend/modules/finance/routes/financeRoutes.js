import { Router } from "express";
import { createStaff, getStaff, searchInactiveStaff, toggleStaffStatus, editStaff } from "../controllers/staffController.js";
import { createExpense, getExpenses, getExpenseSummary, updateExpense, deleteExpense } from "../controllers/expenseController.js";
import { 
  getOrGeneratePayroll, 
  togglePayrollStatus, 
  getPayrollSummary, 
  bulkPayPayroll 
} from "../controllers/payrollController.js";
// import { getOperationsPayables, toggleOperationsPayableStatus } from "../controllers/operationsFinanceController.js";
import { getProjectLedger, getEntityLedger } from "../controllers/ledgerController.js";
const router = Router();

// Staff
router.post("/staff", createStaff);
router.get("/staff", getStaff);
router.get("/staff/inactive", searchInactiveStaff);
router.put("/staff/:id/status", toggleStaffStatus);
router.put("/staff/:id", editStaff);
// Expenses
router.post("/expenses", createExpense);
router.get("/expenses", getExpenses);
router.get("/expenses/summary", getExpenseSummary); 
router.put("/expenses/:id", updateExpense);
router.delete("/expenses/:id", deleteExpense);
// Payroll
router.post("/payroll/generate", getOrGeneratePayroll);
router.get("/payroll/summary", getPayrollSummary); 
router.put("/payroll/bulk-pay", bulkPayPayroll); 
router.put("/payroll/:id/status", togglePayrollStatus); 

// Operations-Finance Routes
// router.get("/operations-payables", getOperationsPayables);
// router.put("/operations-payables/:id/status", toggleOperationsPayableStatus);

// Ledgers
router.get("/ledgers/project/:projectId", getProjectLedger);
router.get("/ledgers/entity/:model/:entityId", getEntityLedger);

export default router;