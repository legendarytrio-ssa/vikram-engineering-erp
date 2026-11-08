import { Routes, Route, Navigate, Link } from "react-router-dom";
import { ArrowRight, Wallet, Users, BookOpen } from "lucide-react";
import PayrollAndExpensesPage from "./pages/PayrollAndExpensesPage.jsx";

function FinanceHub() {
  const subDepts = [
    {
      name: "Payroll & Daily Expenses",
      description: "Manage monthly salaries, weekly wages, staff rosters, and day-to-day operational expenses.",
      icon: Users,
      path: "payroll-expenses",
      available: true,
    },
    {
      name: "Immutable Ledgers",
      description: "Inspect append-only project, vendor, client, and staff financial ledgers. (UI Pending)",
      icon: BookOpen,
      path: "ledgers",
      available: false, // We will unlock this once the Ledger UI format is uploaded
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <header className="mb-12 flex items-center justify-between border-b border-zinc-800 pb-8">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-600">
              <Wallet size={25} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Vikram Engineering</h1>
              <p className="mt-1 text-xs tracking-[0.2em] text-zinc-500">FINANCE DEPARTMENT</p>
            </div>
          </div>
          <Link to="/" className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs text-zinc-300 hover:border-zinc-700">
            ← All Departments
          </Link>
        </header>

        <section className="mb-12">
          <p className="mb-3 text-sm font-medium tracking-widest text-emerald-400">FINANCE WORKSPACE</p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Select Sub-Department</h2>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subDepts.map((dept) => {
            const Icon = dept.icon;
            const card = (
              <div className={`group flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 ${
                dept.available ? "border-zinc-800 bg-zinc-900 hover:-translate-y-1 hover:border-emerald-500/50" : "cursor-not-allowed border-zinc-800/60 bg-zinc-900/40 opacity-50"
              }`}>
                <div className="mb-8 flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Icon size={23} />
                  </div>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    {dept.available ? "Available" : "Coming Soon"}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{dept.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-zinc-400">{dept.description}</p>
                <div className="mt-8 flex items-center gap-2 text-sm font-medium text-emerald-400">
                  <span>{dept.available ? "Enter Workspace" : "Pending"}</span>
                  {dept.available && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
                </div>
              </div>
            );

            return dept.available ? <Link key={dept.name} to={dept.path} className="block">{card}</Link> : <div key={dept.name}>{card}</div>;
          })}
        </section>
      </div>
    </main>
  );
}

export default function FinanceRoutes() {
  return (
    <Routes>
      <Route index element={<FinanceHub />} />
      <Route path="payroll-expenses" element={<PayrollAndExpensesPage />} />
      <Route path="*" element={<Navigate to="/finance" replace />} />
    </Routes>
  );
}