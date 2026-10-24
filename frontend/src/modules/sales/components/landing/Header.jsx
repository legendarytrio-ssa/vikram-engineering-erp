import Brand from "./Brand";

export default function Header({
  eyebrow = "TENDER MANAGEMENT",
}) {
  return (
    <header className="flex flex-col gap-5 border-b border-zinc-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <Brand />

      <div className="flex items-center gap-2 self-start rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 sm:self-auto">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        {eyebrow}
      </div>
    </header>
  );
}