
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShoppingCart,
  Microscope,
  Settings,
} from "lucide-react";

const operationsRoles = [
  {
    name: "Purchase Department",
    description:
      "Manage project materials, create purchase orders, and handle vendor documents.",
    icon: ShoppingCart,
    path: "purchase",
    available: true,
  },
  {
    name: "Quality Control",
    description:
      "Manage site inspections, verify material quality, and generate QC reports.",
    icon: Microscope,
    path: "qc",
    available: false,
  },
];

export default function OperationsRoleSelection() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        {/* Header Section */}
        <header className="mb-12 border-b border-zinc-800 pb-8">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-600">
              <Settings size={25} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Vikram Engineering
              </h1>
              <p className="mt-1 text-xs tracking-[0.2em] text-zinc-500">
                OPERATIONS DEPARTMENT
              </p>
            </div>
          </div>
        </header>

        {/* Introduction */}
        <section className="mb-12">
          <p className="mb-3 text-sm font-medium tracking-widest text-emerald-400">
            OPERATIONS WORKSPACE
          </p>

          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Select your role
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            Choose a sub-department to access your specific tools,
            project vaults, and active workflows.
          </p>
        </section>

        {/* Roles Grid */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {operationsRoles.map((role) => {
            const Icon = role.icon;

            const cardContent = (
              <div
                className={`group flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 ${
                  role.available
                    ? "border-zinc-800 bg-zinc-900 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-zinc-900/80"
                    : "cursor-not-allowed border-zinc-800/60 bg-zinc-900/40 opacity-50"
                }`}
              >
                <div className="mb-8 flex items-start justify-between">
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-xl ${
                      role.available
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    <Icon size={23} />
                  </div>

                  {role.available ? (
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                      Available
                    </span>
                  ) : (
                    <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-500">
                      Coming Soon
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold">
                  {role.name}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-zinc-400">
                  {role.description}
                </p>

                <div
                  className={`mt-8 flex items-center gap-2 text-sm font-medium ${
                    role.available
                      ? "text-emerald-400"
                      : "text-zinc-600"
                  }`}
                >
                  {role.available ? "Enter Workspace" : "Unavailable"}

                  {role.available && (
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </div>
              </div>
            );

            return role.available ? (
              <Link
                key={role.name}
                to={role.path}
                className="block"
              >
                {cardContent}
              </Link>
            ) : (
              <div key={role.name}>{cardContent}</div>
            );
          })}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-zinc-800 pt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} Vikram Engineering. All rights
          reserved.
        </footer>
      </div>
    </main>
  );
}
