export default function TextInput({
  id,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  className = "",
  ...props
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      {...props}
      className={`w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 ${className}`}
    />
  );
}