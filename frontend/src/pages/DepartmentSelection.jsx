
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Boxes,
  Users,
  Wallet,
} from "lucide-react";

const departments = [
  {
    name: "Sales",
    description: "Manage clients, tenders, sales operations and business opportunities.",
    icon: BriefcaseBusiness,
    path: "/sales",
    available: true,
  },
  {
    name: "Inventory",
    description: "Manage inventory, materials, stock levels and product records.",
    icon: Boxes,
    path: "/inventory",
    available: false,
  },
  {
    name: "Human Resources",
    description: "Manage employees, attendance and workforce operations.",
    icon: Users,
    path: "/hr",
    available: false,
  },
  {
    name: "Finance",
    description: "Manage payments, financial records and business expenses.",
    icon: Wallet,
    path: "/finance",
    available: false,
  },
];

export default function DepartmentSelection() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-600">
              <Building2 size={22} />
            </div>

            <div>
              <h1 className="text-base font-semibold tracking-tight">
                Vikram Engineering
              </h1>
              <p className="text-xs tracking-widest text-zinc-500">
                ERP WORKSPACE
              </p>
            </div>
          </div>

          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs text-zinc-400">
            Enterprise Portal
          </span>
        </header>

        {/* Hero */}
        <section className="pb-12 pt-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-400">
            <Building2 size={14} />
            Centralized Business Management
          </div>

          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Welcome to your
            <span className="block mt-2 text-emerald-400">
              ERP Workspace
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
            Access and manage your business operations from one
            centralized platform. Select a department to continue.
          </p>
        </section>

        {/* Department Cards */}
        <section className="pb-20">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Departments
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Choose your workspace
              </p>
            </div>

            <span className="text-xs text-zinc-500">
              {departments.length} Departments
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {departments.map((department) => {
              const Icon = department.icon;

              const content = (
                <>
                  <div className="mb-7 flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Icon size={23} />
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-[11px] font-medium ${
                        department.available
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {department.available ? "Available" : "Coming Soon"}
                    </span>
                  </div>

                  <h4 className="text-xl font-semibold">
                    {department.name}
                  </h4>

                  <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">
                    {department.description}
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-emerald-400">
                    {department.available
                      ? "Open Department"
                      : "Under Development"}

                    {department.available && <ArrowRight size={17} />}
                  </div>
                </>
              );

              return department.available ? (
                <Link
                  key={department.name}
                  to={department.path}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-zinc-900 hover:shadow-xl hover:shadow-emerald-950/20"
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={department.name}
                  className="cursor-not-allowed rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 opacity-65"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col gap-2 border-t border-zinc-800 py-6 text-xs text-zinc-500 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Vikram Engineering</p>
          <p>Enterprise Resource Planning System</p>
        </footer>
      </div>
    </main>
  );
}
