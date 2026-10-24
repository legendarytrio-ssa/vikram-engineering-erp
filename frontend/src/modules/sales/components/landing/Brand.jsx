import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

export default function Brand() {
  return (
    <Link
      to="/"
      className="flex items-center gap-3"
      aria-label="Vikram Engineering home"
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
        <Building2 size={19} strokeWidth={1.8} />
      </span>

      <span>
        <span className="block text-sm font-semibold tracking-tight text-zinc-100">
          Vikram Engineering
        </span>
        <span className="mt-0.5 block text-[11px] tracking-[0.13em] text-zinc-400">
          ERP WORKSPACE
        </span>
      </span>
    </Link>
  );
}