export default function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-800 p-4">
      <p className="text-xs text-zinc-400">{label}</p>

      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
        {value}
      </p>
    </div>
  );
}