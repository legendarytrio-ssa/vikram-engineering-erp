
// import { Link } from "react-router-dom";
// import {
//   ArrowRight,
//   BriefcaseBusiness,
//   Building2,
//   Boxes,
//   Users,
//   Wallet,
//   Settings,
// } from "lucide-react";

// const departments = [
//   {
//     name: "Sales",
//     description:
//       "Manage tenders, clients, customer relationships and sales activities.",
//     icon: BriefcaseBusiness,
//     path: "/sales",
//     available: true,
//   },
//   {
//     name: "Inventory",
//     description:
//       "Manage stock, materials, inventory records and warehouse activities.",
//     icon: Boxes,
//     path: "/inventory",
//     available: false,
//   },
//   {
//     name: "Human Resources",
//     description:
//       "Manage employees, recruitment, attendance and HR activities.",
//     icon: Users,
//     path: "/hr",
//     available: false,
//   },
//   {
//     name: "Finance",
//     description:
//       "Manage accounts, transactions, budgets and financial records.",
//     icon: Wallet,
//     path: "/finance",
//     available: false,
//   },
//   {
//     name: "Operations",
//     description:
//       "Manage daily business operations, workflows, project execution and operational activities.",
//     icon: Settings,
//     path: "/operations",
//     available: true,
//   },
// ];

// export default function DepartmentSelection() {
//   return (
//     <main className="min-h-screen bg-zinc-950 text-zinc-100">
//       <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
//         {/* Header */}
//         <header className="flex items-center gap-4 border-b border-zinc-800 pb-8">
//           <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-600">
//             <Building2 size={25} />
//           </div>

//           <div>
//             <h1 className="text-xl font-semibold tracking-tight">
//               Vikram Engineering
//             </h1>
//             <p className="mt-1 text-xs tracking-[0.2em] text-zinc-500">
//               ENTERPRISE RESOURCE PLANNING
//             </p>
//           </div>
//         </header>

//         {/* Introduction */}
//         <section className="py-14">
//           <p className="mb-3 text-sm font-medium tracking-widest text-emerald-400">
//             WORKSPACE
//           </p>

//           <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
//             Select your department
//           </h2>

//           <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
//             Choose a department to access its dedicated workspace and
//             manage your organization's activities.
//           </p>
//         </section>

//         {/* Department Cards */}
//         <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           {departments.map((department) => {
//             const Icon = department.icon;

//             const cardContent = (
//               <div
//                 className={`group flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 ${
//                   department.available
//                     ? "border-zinc-800 bg-zinc-900 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-zinc-900/80"
//                     : "cursor-not-allowed border-zinc-800/60 bg-zinc-900/40 opacity-50"
//                 }`}
//               >
//                 <div className="mb-8 flex items-start justify-between">
//                   <div
//                     className={`grid h-12 w-12 place-items-center rounded-xl ${
//                       department.available
//                         ? "bg-emerald-500/10 text-emerald-400"
//                         : "bg-zinc-800 text-zinc-500"
//                     }`}
//                   >
//                     <Icon size={23} />
//                   </div>

//                   {department.available ? (
//                     <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
//                       Available
//                     </span>
//                   ) : (
//                     <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-500">
//                       Coming Soon
//                     </span>
//                   )}
//                 </div>

//                 <h3 className="text-lg font-semibold">
//                   {department.name}
//                 </h3>

//                 <p className="mt-3 flex-1 text-sm leading-6 text-zinc-400">
//                   {department.description}
//                 </p>

//                 <div
//                   className={`mt-8 flex items-center gap-2 text-sm font-medium ${
//                     department.available
//                       ? "text-emerald-400"
//                       : "text-zinc-600"
//                   }`}
//                 >
//                   {department.available ? "Open Workspace" : "Unavailable"}

//                   {department.available && (
//                     <ArrowRight
//                       size={16}
//                       className="transition-transform group-hover:translate-x-1"
//                     />
//                   )}
//                 </div>
//               </div>
//             );

//             return department.available ? (
//               <Link
//                 key={department.name}
//                 to={department.path}
//                 className="block"
//               >
//                 {cardContent}
//               </Link>
//             ) : (
//               <div key={department.name}>{cardContent}</div>
//             );
//           })}
//         </section>

//         {/* Footer */}
//         <footer className="mt-16 border-t border-zinc-800 pt-6 text-xs text-zinc-500">
//           © {new Date().getFullYear()} Vikram Engineering. All rights
//           reserved.
//         </footer>
//       </div>
//     </main>
//   );
// }


import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Boxes,
  Users,
  Wallet,
  Settings,
  Shield,
} from "lucide-react";

const departments = [
  {
    name: "Sales",
    description:
      "Manage tenders, clients, customer relationships and sales activities.",
    icon: BriefcaseBusiness,
    path: "/sales",
    available: true,
  },
  {
    name: "Inventory",
    description:
      "Manage stock, materials, inventory records and warehouse activities.",
    icon: Boxes,
    path: "/inventory",
    available: false,
  },
  {
    name: "Human Resources",
    description:
      "Manage employees, recruitment, attendance and HR activities.",
    icon: Users,
    path: "/hr",
    available: false,
  },
  {
    name: "Finance",
    description:
      "Manage accounts, transactions, budgets and financial records.",
    icon: Wallet,
    path: "/finance",
    available: false,
  },
  {
    name: "Operations",
    description:
      "Manage daily business operations, workflows, project execution and operational activities.",
    icon: Settings,
    path: "/operations",
    available: true,
  },
];

export default function DepartmentSelection() {
  const navigate = useNavigate();

  const handleCeoAccess = () => {
    const password = window.prompt("Enter CEO Access Password:");
    if (password === "admin") {
      navigate("/ceo/ceo-dashboard");
    } else if (password !== null) {
      alert("Unauthorized: Incorrect password.");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-zinc-800 pb-8">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-600">
              <Building2 size={25} />
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Vikram Engineering
              </h1>
              <p className="mt-1 text-xs tracking-[0.2em] text-zinc-500">
                ENTERPRISE RESOURCE PLANNING
              </p>
            </div>
          </div>

          <button
            onClick={handleCeoAccess}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:-translate-y-0.5 hover:border-amber-500/50 hover:bg-zinc-800 hover:text-white"
          >
            <Shield size={16} className="text-amber-500" />
            CEO Dashboard
          </button>
        </header>

        {/* Introduction */}
        <section className="py-14">
          <p className="mb-3 text-sm font-medium tracking-widest text-emerald-400">
            WORKSPACE
          </p>

          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Select your department
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            Choose a department to access its dedicated workspace and
            manage your organization's activities.
          </p>
        </section>

        {/* Department Cards */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => {
            const Icon = department.icon;

            const cardContent = (
              <div
                className={`group flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 ${
                  department.available
                    ? "border-zinc-800 bg-zinc-900 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-zinc-900/80"
                    : "cursor-not-allowed border-zinc-800/60 bg-zinc-900/40 opacity-50"
                }`}
              >
                <div className="mb-8 flex items-start justify-between">
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-xl ${
                      department.available
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    <Icon size={23} />
                  </div>

                  {department.available ? (
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
                  {department.name}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-zinc-400">
                  {department.description}
                </p>

                <div
                  className={`mt-8 flex items-center gap-2 text-sm font-medium ${
                    department.available
                      ? "text-emerald-400"
                      : "text-zinc-600"
                  }`}
                >
                  {department.available ? "Open Workspace" : "Unavailable"}

                  {department.available && (
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </div>
              </div>
            );

            return department.available ? (
              <Link
                key={department.name}
                to={department.path}
                className="block"
              >
                {cardContent}
              </Link>
            ) : (
              <div key={department.name}>{cardContent}</div>
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