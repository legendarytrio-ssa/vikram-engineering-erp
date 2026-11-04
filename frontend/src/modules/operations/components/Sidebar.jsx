import { NavLink } from "react-router-dom";
import { Settings, ShoppingCart, Microscope, BriefcaseBusiness, Wallet, Building2 } from "lucide-react";

export default function Sidebar() {
  const navItems = [
    { name: "Operations Hub", path: "/operations", icon: Settings, exact: true },
    { name: "Purchase Dept", path: "/operations/purchase", icon: ShoppingCart, exact: false },
    { name: "QC Inspections", path: "/operations/qc", icon: Microscope, exact: false },
    { name: "Sales", path: "/sales", icon: BriefcaseBusiness, exact: false },
    { name: "Finance", path: "/finance", icon: Wallet, exact: false },
  ];

  return (
    <aside className="w-64 bg-zinc-950 text-zinc-100 flex flex-col h-full border-r border-zinc-800">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-zinc-800">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600">
          <Building2 size={18} />
        </div>
        <span className="text-lg font-semibold tracking-tight">VE Portal</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium border ${
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                    : "border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`
              }
            >
              <Icon size={18} className={({ isActive }) => isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}