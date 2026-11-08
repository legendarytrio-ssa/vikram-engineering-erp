import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Calendar,
  CheckCircle2,
  IndianRupee,
  Clock,
  Plus,
  Search,
  Loader2,
  UserPlus,
  UserMinus,
  Pencil,
  Trash2,
} from "lucide-react";
import financeApi from "../api/financeApi";

const DUMMY_USER_ID = "609c0e77818e690015569abc";
const PAY_MODES = ["BANK", "UPI", "CASH", "CHEQUE"];

function formatINR(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

// Reusable Metric Card
const Metric = ({ title, value, subtitle, icon: Icon, colorClass }) => (
  <div className={`rounded-2xl border bg-zinc-900 p-5 ${colorClass}`}>
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wider">
        {title}
      </span>
      <Icon size={18} />
    </div>
    <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    <p className="mt-1 text-xs opacity-70">{subtitle}</p>
  </div>
);

export default function PayrollAndExpensesPage() {
  const [activeTab, setActiveTab] = useState("SALARIES"); // SALARIES, WAGES, EXPENSES
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  // Payroll State
  const [records, setRecords] = useState([]);
  const [periodLabel, setPeriodLabel] = useState("");
  const [payrollSummary, setPayrollSummary] = useState({
    DUE: { count: 0, total: 0 },
    PAID: { count: 0, total: 0 },
  });

  // Custom Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Expenses State
  const [expenses, setExpenses] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState({
    totalAmount: 0,
    count: 0,
  });

  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Bulk Pay State
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkMode, setBulkMode] = useState("BANK");
  const [bulkRef, setBulkRef] = useState("");

  // --- EXPENSE MODAL STATE ---
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [submittingExpense, setSubmittingExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [expenseForm, setExpenseForm] = useState({
    category: "",
    amount: "",
    description: "",
    paymentMode: "CASH",
  });

  const handleLogExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.category || !expenseForm.amount) return;
    setSubmittingExpense(true);
    try {
      const timeString = new Date().toISOString().split("T")[1];
      const dateTime = `${selectedDate}T${timeString}`;

      const payload = {
        date: dateTime,
        category: expenseForm.category,
        amount: Number(expenseForm.amount),
        description: expenseForm.description,
        paymentMode: expenseForm.paymentMode,
        createdBy: DUMMY_USER_ID,
      };

      if (editingExpenseId) {
        await financeApi.put(`/expenses/${editingExpenseId}`, payload);
        showToast("Expense updated successfully.", "success");
      } else {
        await financeApi.post("/expenses", payload);
        showToast("Expense logged successfully.", "success");
      }

      setShowExpenseModal(false);
      setEditingExpenseId(null);
      setExpenseForm({
        category: "",
        amount: "",
        description: "",
        paymentMode: "CASH",
      });
      await fetchData();
    } catch (err) {
      showToast(
        err.response?.data?.error || "Failed to save expense.",
        "error"
      );
    } finally {
      setSubmittingExpense(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;
    try {
      await financeApi.delete(`/expenses/${id}`);
      showToast("Expense deleted.", "success");
      await fetchData();
    } catch (err) {
      showToast("Failed to delete expense.", "error");
    }
  };

  // --- STAFF MANAGEMENT STATE ---
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffTab, setStaffTab] = useState("ADD");
  const [submittingStaff, setSubmittingStaff] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [staffForm, setStaffForm] = useState({
    empCode: "",
    empName: "",
    designation: "",
    baseAmount: "",
    joiningDate: selectedDate,
  });
  const [manageStaffList, setManageStaffList] = useState([]);
  const [viewInactive, setViewInactive] = useState(false);
  const [staffSearch, setStaffSearch] = useState("");

  const fetchStaffDirectory = useCallback(async () => {
    try {
      const payType = activeTab === "SALARIES" ? "SALARIED" : "WAGED";
      const endpoint = viewInactive ? "/staff/inactive" : "/staff";
      const params = { payType };
      if (staffSearch) params.query = staffSearch;

      const res = await financeApi.get(endpoint, { params });
      setManageStaffList(res.data);
    } catch (err) {
      console.error("Failed to fetch staff directory", err);
    }
  }, [activeTab, viewInactive, staffSearch]);

  useEffect(() => {
    if (showStaffModal && staffTab === "MANAGE") {
      const delay = setTimeout(() => fetchStaffDirectory(), 300);
      return () => clearTimeout(delay);
    }
  }, [
    showStaffModal,
    staffTab,
    fetchStaffDirectory,
    staffSearch,
    viewInactive,
  ]);

  const handleAddOrEditStaff = async (e) => {
    e.preventDefault();
    setSubmittingStaff(true);
    try {
      const payload = {
        ...staffForm,
        dept: "OPERATIONS",
        payType: activeTab === "SALARIES" ? "SALARIED" : "WAGED",
        baseAmount: Number(staffForm.baseAmount),
      };

      if (editingStaffId) {
        await financeApi.put(`/staff/${editingStaffId}`, payload);
        showToast("Employee details updated.", "success");
      } else {
        await financeApi.post("/staff", payload);
        showToast("Employee onboarded successfully.", "success");
      }

      setStaffForm({
        empCode: "",
        empName: "",
        designation: "",
        baseAmount: "",
        joiningDate: selectedDate,
      });
      setEditingStaffId(null);
      await fetchData();
    } catch (err) {
      showToast(
        err.response?.data?.error || "Failed to save employee.",
        "error"
      );
    } finally {
      setSubmittingStaff(false);
    }
  };

  const startEditStaff = (emp) => {
    setEditingStaffId(emp._id);
    setStaffForm({
      empCode: emp.empCode,
      empName: emp.empName,
      designation: emp.designation || "",
      baseAmount: emp.baseAmount,
      joiningDate: emp.joiningDate
        ? emp.joiningDate.split("T")[0]
        : selectedDate,
    });
    setStaffTab("ADD");
  };

  const handleToggleStaffStatus = async (staffId, currentActiveStatus) => {
    try {
      await financeApi.put(`/staff/${staffId}/status`, { isActive: !currentActiveStatus });
      await fetchStaffDirectory(); 
      await fetchData(); 
      showToast(`Employee ${currentActiveStatus ? 'deactivated' : 'reactivated'} successfully.`, "success");
    } catch (err) {
      showToast("Failed to update employee status.", "error");
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setSelectedIds([]);
    try {
      if (activeTab === "SALARIES" || activeTab === "WAGES") {
        const payType = activeTab === "SALARIES" ? "MONTHLY" : "WEEKLY";

        // 1. Generate/Fetch Payroll
        const res = await financeApi.post("/payroll/generate", {
          date: selectedDate,
          payType,
          userId: DUMMY_USER_ID,
        });
        setRecords(res.data.records);
        setPeriodLabel(res.data.periodLabel);

        // 2. Fetch Summary
        const sumRes = await financeApi.get("/payroll/summary", {
          params: { date: selectedDate, payType },
        });
        setPayrollSummary(sumRes.data);
      } else if (activeTab === "EXPENSES") {
        const [expRes, sumRes] = await Promise.all([
          financeApi.get("/expenses", { params: { date: selectedDate } }),
          financeApi.get("/expenses/summary", {
            params: { date: selectedDate, view: "DAILY" },
          }),
        ]);
        setExpenses(expRes.data);
        setExpenseSummary(sumRes.data);
      }
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTogglePayrollStatus = async (id, currentStatus) => {
    try {
      setProcessingId(id);
      const newStatus = currentStatus === "DUE" ? "PAID" : "DUE";
      const payload = { status: newStatus, userId: DUMMY_USER_ID };

      if (newStatus === "PAID") {
        payload.paymentMode = "BANK";
        payload.referenceNo = "DIR-PAY-" + Date.now().toString().slice(-4);
      }

      await financeApi.put(`/payroll/${id}/status`, payload);
      await fetchData();
    } catch (err) {
      showToast("Failed to update status", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleBulkPay = async () => {
    if (!selectedIds.length) return;
    try {
      setLoading(true);
      await financeApi.put("/payroll/bulk-pay", {
        recordIds: selectedIds,
        paymentMode: bulkMode,
        referenceNo: bulkRef || `BULK-${selectedDate}`,
        userId: DUMMY_USER_ID,
      });
      setBulkRef("");
      await fetchData();
    } catch (err) {
      showToast("Bulk payment failed", "error");
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const dueFilteredIds = records
    .filter((r) => r.status === "DUE")
    .map((r) => r._id);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 pb-16">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-md transition-all duration-300 ${
            toast.type === "success"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border border-rose-500/30 bg-rose-500/10 text-rose-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <span className="font-bold text-lg leading-none">!</span>
          )}
          {toast.message}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Payroll & Expenses
            </h1>
            <p className="mt-0.5 text-xs tracking-[0.18em] text-zinc-500">
              WORKFORCE & DAY-TO-DAY OPERATIONS
            </p>
          </div>
          <Link
            to="/finance"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white"
          >
            <ArrowLeft size={15} /> Back to Hub
          </Link>
        </header>

        {/* Tab & Date Selector */}
        <section className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex space-x-1 rounded-xl bg-zinc-900/80 p-1 border border-zinc-800">
            {["SALARIES", "WAGES", "EXPENSES"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                {tab === "SALARIES"
                  ? "Monthly Salaries"
                  : tab === "WAGES"
                  ? "Weekly Wages"
                  : "Daily Expenses"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-medium uppercase text-zinc-500">
              <Calendar size={14} className="text-emerald-400" />
              Target Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              onKeyDown={(e) => e.preventDefault()}
              className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition hover:border-zinc-700 focus:border-emerald-500 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </section>

        {/* Dynamic Metric Cards */}
        {activeTab !== "EXPENSES" ? (
          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <Metric
              title={`Outstanding (${activeTab === "SALARIES" ? "Monthly" : "Weekly"})`}
              value={formatINR(payrollSummary.DUE.total)}
              subtitle={`${payrollSummary.DUE.count} staff members DUE`}
              icon={Clock}
              colorClass="border-amber-500/20 text-amber-400"
            />
            <Metric
              title="Settled (PAID)"
              value={formatINR(payrollSummary.PAID.total)}
              subtitle={`${payrollSummary.PAID.count} staff members PAID`}
              icon={CheckCircle2}
              colorClass="border-emerald-500/20 text-emerald-400"
            />
            <Metric
              title="Total Payroll Size"
              value={formatINR(payrollSummary.DUE.total + payrollSummary.PAID.total)}
              subtitle={`For period: ${periodLabel}`}
              icon={Users}
              colorClass="border-zinc-800 text-zinc-400"
            />
          </section>
        ) : (
          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <Metric
              title="Total Daily Expenditures"
              value={formatINR(expenseSummary.totalAmount)}
              subtitle={`${expenseSummary.count} expenses logged on ${selectedDate}`}
              icon={IndianRupee}
              colorClass="border-rose-500/20 text-rose-400"
            />
          </section>
        )}

        {/* --- PAYROLL RENDER (SALARIES & WAGES) --- */}
        {(activeTab === "SALARIES" || activeTab === "WAGES") && (
          <div className="mt-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Payroll Slips</h2>
                  <p className="text-xs text-zinc-400">{periodLabel}</p>
                </div>

                <button
                  onClick={() => {
                    setStaffTab("ADD");
                    setShowStaffModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                >
                  <Users size={14} className="text-emerald-400" />
                  Staff Directory
                </button>
              </div>

              {dueFilteredIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
                  <span className="text-xs font-medium text-emerald-300">
                    {selectedIds.length} Selected
                  </span>
                  <select
                    value={bulkMode}
                    onChange={(e) => setBulkMode(e.target.value)}
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100"
                  >
                    {PAY_MODES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={bulkRef}
                    onChange={(e) => setBulkRef(e.target.value)}
                    placeholder="Batch Ref"
                    className="w-24 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100"
                  />
                  <button
                    onClick={handleBulkPay}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    Mark Selected PAID
                  </button>
                  <button
                    onClick={() =>
                      setSelectedIds(
                        selectedIds.length === dueFilteredIds.length
                          ? []
                          : dueFilteredIds
                      )
                    }
                    className="text-xs text-emerald-400 underline"
                  >
                    {selectedIds.length === dueFilteredIds.length
                      ? "Deselect All"
                      : "Select All DUE"}
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
                <Loader2 className="animate-spin text-emerald-400" />
              </div>
            ) : records.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 py-12 text-center text-zinc-500 text-sm">
                No active staff found for this payroll type.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="border-b border-zinc-800 bg-zinc-950/50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="p-4 w-10"></th>
                      <th className="p-4">Employee</th>
                      <th className="p-4">Designation</th>
                      <th className="p-4">Net Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {records.map((r) => {
                      const isDue = r.status === "DUE";
                      const inactiveBadge = !r.staff.isActive && (
                        <span className="ml-2 rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
                          INACTIVE NOW
                        </span>
                      );

                      return (
                        <tr
                          key={r._id}
                          className={`transition ${
                            isDue ? "bg-zinc-900 hover:bg-zinc-800/80" : "bg-zinc-950/40"
                          }`}
                        >
                          <td className="p-4">
                            {isDue && (
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(r._id)}
                                onChange={() => toggleSelect(r._id)}
                                className="accent-emerald-500"
                              />
                            )}
                          </td>
                          <td className="p-4 font-medium text-zinc-100">
                            {r.staff.empName}{" "}
                            <span className="block text-xs font-normal text-zinc-500">
                              {r.staff.empCode} {inactiveBadge}
                            </span>
                          </td>
                          <td className="p-4 text-zinc-400">
                            {r.staff.designation || "Staff"}
                          </td>
                          <td className="p-4 font-semibold text-emerald-400">
                            {formatINR(r.netAmount)}
                          </td>
                          <td className="p-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                isDue
                                  ? "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                                  : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {isDue ? (
                              <button
                                onClick={() => handleTogglePayrollStatus(r._id, "DUE")}
                                disabled={processingId === r._id}
                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                              >
                                Mark PAID
                              </button>
                            ) : (
                              <button
                                onClick={() => handleTogglePayrollStatus(r._id, "PAID")}
                                disabled={processingId === r._id}
                                className="text-xs font-medium text-zinc-500 hover:text-zinc-300 underline"
                              >
                                Revert to DUE
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- EXPENSES RENDER --- */}
        {activeTab === "EXPENSES" && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Daily Expenditures</h2>
              <button
                onClick={() => setShowExpenseModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                <Plus size={16} /> Log Expense
              </button>
            </div>

            {loading ? (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
                <Loader2 className="animate-spin text-emerald-400" />
              </div>
            ) : expenses.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 py-12 text-center text-zinc-500 text-sm">
                No expenses logged for this date.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {expenses.map((exp) => (
                  <div key={exp._id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300">
                        {exp.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">
                          {new Date(exp.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={() => {
                            setEditingExpenseId(exp._id);
                            setExpenseForm({
                              category: exp.category,
                              amount: exp.amount,
                              description: exp.description || "",
                              paymentMode: exp.paymentMode || "CASH",
                            });
                            setShowExpenseModal(true);
                          }}
                          className="text-zinc-500 hover:text-emerald-400"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(exp._id)}
                          className="text-zinc-500 hover:text-rose-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-100">
                      {exp.description || "No description provided."}
                    </p>
                    <div className="mt-4 flex items-end justify-between border-t border-zinc-800/80 pt-3">
                      <span className="text-xs text-zinc-500">
                        Mode: {exp.paymentMode || "CASH"}
                      </span>
                      <span className="text-lg font-bold text-rose-400">
                        {formatINR(exp.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- EXPENSE MODAL --- */}
      {showExpenseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setShowExpenseModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white">Log Daily Expense</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Recording expense for <span className="font-medium text-emerald-400">{selectedDate}</span>
            </p>

            <form onSubmit={handleLogExpense} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300">Category *</label>
                <input
                  type="text"
                  required
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  placeholder="e.g. Travel, Office Supplies, Logistics"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-300">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-300">Payment Mode</label>
                  <select
                    value={expenseForm.paymentMode}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paymentMode: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                  >
                    {PAY_MODES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300">Description (Optional)</label>
                <textarea
                  rows="2"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  placeholder="Additional details..."
                  className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingExpense}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {submittingExpense && <Loader2 size={14} className="animate-spin" />}
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- STAFF DIRECTORY MODAL --- */}
      {showStaffModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setShowStaffModal(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-zinc-800 bg-zinc-950/50 p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users size={18} className="text-emerald-400" />
                Staff Directory & Onboarding
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Managing{" "}
                <span className="font-medium text-emerald-400">
                  {activeTab === "SALARIES" ? "Salaried (Monthly)" : "Waged (Weekly)"}
                </span>{" "}
                workforce.
              </p>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setStaffTab("ADD")}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    staffTab === "ADD"
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  Onboard New Employee
                </button>
                <button
                  onClick={() => setStaffTab("MANAGE")}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    staffTab === "MANAGE"
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  Manage Status
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 h-[400px] overflow-y-auto">
              {staffTab === "ADD" ? (
                <form onSubmit={handleAddOrEditStaff} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-300">Employee Code *</label>
                      <input type="text" required value={staffForm.empCode} onChange={(e) => setStaffForm({ ...staffForm, empCode: e.target.value.toUpperCase() })} placeholder="e.g. EMP-1042" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-300">Full Name *</label>
                      <input type="text" required value={staffForm.empName} onChange={(e) => setStaffForm({ ...staffForm, empName: e.target.value })} placeholder="e.g. Ramesh Kumar" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-300">Designation</label>
                      <input type="text" value={staffForm.designation} onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })} placeholder="e.g. Site Supervisor" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-300">Base Pay (₹) *</label>
                      <input type="number" required min="1" step="any" value={staffForm.baseAmount} onChange={(e) => setStaffForm({ ...staffForm, baseAmount: e.target.value })} placeholder="45000" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1.5 block text-xs font-medium text-zinc-300">Joining Date *</label>
                      <input type="date" required value={staffForm.joiningDate} onChange={(e) => setStaffForm({ ...staffForm, joiningDate: e.target.value })} onClick={(e) => e.target.showPicker && e.target.showPicker()} onKeyDown={(e) => e.preventDefault()} className="w-full cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:invert" />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-2">
                    {editingStaffId && (
                      <button type="button" onClick={() => { setEditingStaffId(null); setStaffForm({ empCode: "", empName: "", designation: "", baseAmount: "", joiningDate: selectedDate }); }} className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800">
                        Cancel Edit
                      </button>
                    )}
                    <button type="submit" disabled={submittingStaff} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50">
                      {submittingStaff ? <Loader2 size={14} className="animate-spin" /> : (editingStaffId ? <Pencil size={14} /> : <UserPlus size={14} />)}
                      {editingStaffId ? "Update Employee" : "Save Employee"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1 w-full">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input type="text" value={staffSearch} onChange={(e) => setStaffSearch(e.target.value)} placeholder="Search employee name or code..." className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-3 text-xs text-zinc-100 outline-none focus:border-emerald-500" />
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 shrink-0">
                      <input type="checkbox" checked={viewInactive} onChange={(e) => setViewInactive(e.target.checked)} className="h-4 w-4 accent-emerald-500" />
                      View Former Staff
                    </label>
                  </div>

                  <div className="space-y-2">
                    {manageStaffList.length === 0 ? (
                      <p className="py-6 text-center text-xs text-zinc-500">No records found.</p>
                    ) : (
                      manageStaffList.map(emp => (
                        <div key={emp._id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
                          <div>
                            <p className="text-sm font-semibold text-zinc-200">{emp.empName}</p>
                            <p className="mt-0.5 text-xs text-zinc-500">{emp.empCode} · {emp.designation}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEditStaff(emp)} className="rounded-lg bg-zinc-800 p-1.5 text-zinc-400 transition hover:bg-zinc-700 hover:text-white">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => handleToggleStaffStatus(emp._id, emp.isActive)} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${emp.isActive ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"}`}>
                              {emp.isActive ? <><UserMinus size={13} /> Deactivate</> : <><UserPlus size={13} /> Reactivate</>}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-800 bg-zinc-950/50 p-4 text-right">
              <button
                onClick={() => setShowStaffModal(false)}
                className="rounded-xl border border-zinc-700 px-5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}