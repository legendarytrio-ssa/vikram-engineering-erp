export default function FieldLabel({
  children,
  required = false,
  htmlFor,
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-zinc-300"
    >
      {children}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
  );
}