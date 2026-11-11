export default function Metric({ label, value, loading = false }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>

      {loading ? (
        <div className="skeleton mt-3 h-8 w-12 rounded-lg" />
      ) : (
        <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-zinc-100">
          {value}
        </p>
      )}
    </div>
  );
}
