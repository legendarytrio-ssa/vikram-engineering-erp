import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  CirclePlus,
  ClipboardList,
  Search,
  Settings2,
  Trash2,
  Users,
  FileUp,
} from "lucide-react";

import Header from "../components/landing/Header";
import FieldLabel from "../components/forms/FieldLabel";
import TextInput from "../components/forms/TextInput";
import salesApi from "../services/salesApi";

const CATEGORIES = [
  { value: "GOVT", label: "Government (GOVT)" },
  { value: "PVT", label: "Private (PVT)" },
];

export default function AddTenderPage() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State aligned with Tender Mongoose Schema
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("GOVT");
  const [description, setDescription] = useState("");

  // File Upload State
  const [tenderDocs, setTenderDocs] = useState([]);

  // Client Search & Selection
  const [clientQuery, setClientQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [showClientOptions, setShowClientOptions] = useState(false);

  // Dynamic attributes matching othersField (Map/Object)
  const [extraAttributes, setExtraAttributes] = useState([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await salesApi.get("/clients/getAllClients");
      const clientData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setClients(clientData);
    } catch (err) {
      console.error("Failed to load clients", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const selectedClient = useMemo(() => {
    return clients.find((c) => c._id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  const matches = useMemo(() => {
    const q = clientQuery.trim().toLowerCase();
    if (!q) return [];
    return clients.filter((c) =>
      (c.name || c.companyName || "").toLowerCase().includes(q)
    );
  }, [clients, clientQuery]);

  const noClientMatch = clientQuery.trim().length > 0 && matches.length === 0 && !selectedClient;

  function pickClient(client) {
    const clientName = client.name || client.companyName;
    setSelectedClientId(client._id);
    setClientQuery(clientName);
    setShowClientOptions(false);
    setError("");

    if (client.type && ["GOVT", "PVT"].includes(client.type)) {
      setCategory(client.type);
    }
  }

  function addAttribute() {
    setExtraAttributes((curr) => [
      ...curr,
      { id: crypto.randomUUID(), name: "", value: "" },
    ]);
  }

  function updateAttribute(id, field, value) {
    setExtraAttributes((curr) =>
      curr.map((attr) => (attr.id === id ? { ...attr, [field]: value } : attr))
    );
  }

  function removeAttribute(id) {
    setExtraAttributes((curr) => curr.filter((attr) => attr.id !== id));
  }

  // Handle file selection (Append instead of replace)

  const handleFileChange = (e) => {
    // First, copy the selected files before clearing the input
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length > 0) {
      setTenderDocs((prev) => [...prev, ...selectedFiles]);
    }

    // Reset input so the same file can be selected again
    e.target.value = "";
  };


  // Handle individual file removal
  const removeFile = (indexToRemove) => {
    setTenderDocs((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  async function submitTender(event) {
    event.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Tender Code is required.");
      return;
    }
    if (!title.trim()) {
      setError("Tender Title is required.");
      return;
    }
    if (!selectedClientId) {
      setError("Please search and select a client from the database.");
      return;
    }

    // Convert key-value array into an object for othersField (Map)
    const othersObject = extraAttributes.reduce((acc, curr) => {
      const k = curr.name.trim();
      if (k) acc[k] = curr.value.trim();
      return acc;
    }, {});

    // Use FormData for multipart/form-data file uploads
    const formData = new FormData();
    formData.append("code", code.trim().toUpperCase());
    formData.append("title", title.trim());
    formData.append("category", category);
    formData.append("description", description.trim());
    formData.append("client", selectedClientId);
    formData.append("status", "PENDING");

    if (Object.keys(othersObject).length > 0) {
      formData.append("others", JSON.stringify(othersObject));
    }

    // Append all accumulated files to the formData
    tenderDocs.forEach((file) => {
      formData.append("tenderDocs", file);
    });

    setIsSubmitting(true);

    try {
      await salesApi.post("/tenders/createTenders", formData);
      setSaved(true);
      setTimeout(() => navigate("/sales"), 800);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to save tender to server."
      );
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 lg:px-10">
        <Header />

        <button
          onClick={() => navigate("/sales")}
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
        >
          <ArrowLeft size={16} />
          Back to overview
        </button>

        <section className="mb-8 mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] text-emerald-500">
              NEW TENDER RECORD
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Add Tender
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
              Register a new tender bid linked to an existing client entity in the database.
            </p>
          </div>

          <span className="w-fit rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400">
            Fields marked <span className="text-rose-500">*</span> are mandatory
          </span>
        </section>

        <form onSubmit={submitTender} className="relative space-y-5">
          {/* 1. TENDER IDENTIFICATION */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-zinc-800 pb-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-300">
                <ClipboardList size={18} />
              </span>
              <div>
                <h2 className="font-semibold text-zinc-100">Tender Details</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Basic identifier, title, and sector category.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="code" required>
                  Tender Code
                </FieldLabel>
                <TextInput
                  id="code"
                  value={code}
                  required
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. TND-2026-001"
                />
              </div>

              <div>
                <FieldLabel htmlFor="category" required>
                  Category
                </FieldLabel>
                <div className="relative">
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 pr-10 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor="title" required>
                  Tender Title
                </FieldLabel>
                <TextInput
                  id="title"
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. High-Grade Titanium Alloy Rod Supply"
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor="description">Description & Scope</FieldLabel>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Scope of supply, metallurgical specs, or delivery terms…"
                  className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </section>

          {/* 2. CLIENT LINKAGE */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-zinc-800 pb-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Building2 size={18} />
              </span>
              <div>
                <h2 className="font-semibold text-zinc-100">Client Reference</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Link this tender to an established client record.
                </p>
              </div>
            </div>

            <div className="relative">
              <FieldLabel htmlFor="client" required>
                Client Name
              </FieldLabel>

              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <TextInput
                  id="client"
                  value={clientQuery}
                  required
                  placeholder="Search existing client by name..."
                  autoComplete="off"
                  className="pl-10"
                  onChange={(event) => {
                    setClientQuery(event.target.value);
                    setSelectedClientId("");
                    setShowClientOptions(true);
                    setError("");
                  }}
                  onFocus={() => setShowClientOptions(true)}
                />
              </div>

              {/* Autocomplete Dropdown */}
              {showClientOptions && clientQuery.trim() && matches.length > 0 && (
                <div className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-zinc-700 bg-zinc-800 p-1.5 shadow-2xl">
                  {matches.map((client) => {
                    const cName = client.name || client.companyName;
                    return (
                      <button
                        type="button"
                        key={client._id}
                        onClick={() => pickClient(client)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-zinc-700"
                      >
                        <div>
                          <span className="block text-sm font-medium text-zinc-200">
                            {cName}
                          </span>
                          <span className="mt-0.5 block text-xs text-zinc-400">
                            Type: {client.type || "N/A"} · CEO: {client.organisationCEO || "Not listed"}
                          </span>
                        </div>
                        <ArrowUpRight size={15} className="text-zinc-500" />
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedClient && (
                <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-900/40 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Check size={14} /> Linked to: {selectedClient.name || selectedClient.companyName} ({selectedClient.type || "N/A"})
                  </span>
                  {selectedClient.contactNo && (
                    <span className="text-emerald-300/80">Tel: {selectedClient.contactNo}</span>
                  )}
                </div>
              )}

              {noClientMatch && (
                <div className="mt-5 flex flex-col gap-3 rounded-xl border border-amber-900/50 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">
                      Client not found in directory
                    </p>
                    <p className="mt-1 text-xs text-amber-400/80">
                      Register this client in the CRM before creating its tender.
                    </p>
                  </div>
                  <Link
                    to="/sales/clients/new"
                    state={{ clientName: clientQuery.trim() }}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-emerald-500 hover:text-white"
                  >
                    <Users size={15} />
                    Add Client
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* 3. ADDITIONAL ATTRIBUTES */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-300">
                  <Settings2 size={18} />
                </span>
                <div>
                  <h2 className="font-semibold text-zinc-100">
                    Custom Metadata (Others)
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Add custom key-value pairs (e.g. Estimated Value, Portal Link).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addAttribute}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                <CirclePlus size={16} />
                Add Field
              </button>
            </div>

            {extraAttributes.length > 0 ? (
              <div className="mt-5 space-y-3">
                {extraAttributes.map((attribute) => (
                  <div
                    key={attribute.id}
                    className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end"
                  >
                    <div>
                      <FieldLabel htmlFor={`attr-name-${attribute.id}`}>
                        Attribute Name
                      </FieldLabel>
                      <TextInput
                        id={`attr-name-${attribute.id}`}
                        value={attribute.name}
                        onChange={(e) =>
                          updateAttribute(attribute.id, "name", e.target.value)
                        }
                        placeholder="e.g. Estimated Budget"
                      />
                    </div>

                    <div>
                      <FieldLabel htmlFor={`attr-value-${attribute.id}`}>
                        Value
                      </FieldLabel>
                      <TextInput
                        id={`attr-value-${attribute.id}`}
                        value={attribute.value}
                        onChange={(e) =>
                          updateAttribute(attribute.id, "value", e.target.value)
                        }
                        placeholder="e.g. ₹50,00,000"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeAttribute(attribute.id)}
                      className="grid h-11 w-11 place-items-center rounded-xl text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-xl border border-dashed border-zinc-800 px-4 py-5 text-center text-sm text-zinc-500">
                No custom metadata added.
              </p>
            )}
          </section>

          {/* 4. DOCUMENTS (FILE UPLOAD) */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-zinc-800 pb-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-300">
                <FileUp size={18} />
              </span>
              <div>
                <h2 className="font-semibold text-zinc-100">Documents</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Upload tender specifications, BOQs, or reference files.
                </p>
              </div>
            </div>

            <div>
              <FieldLabel>Tender Attachments</FieldLabel>

              {/* Flex container groups the button and the files side-by-side */}
              <div className="mt-3 flex flex-wrap items-center gap-3">

                {/* 1. Custom Upload Button */}
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-500 transition hover:bg-emerald-500/20 hover:border-emerald-500/50">
                  <CirclePlus size={16} />
                  {tenderDocs.length > 0 ? "Add More" : "Browse Files"}

                  {/* Hidden native input */}
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>

                {tenderDocs.length > 0 && (
                  <span className="text-xs text-emerald-400">
                    {tenderDocs.length} file(s) selected
                  </span>
                )}

                {/* 2. Uploaded File Chips rendered BESIDE the button */}
                {tenderDocs.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2.5 rounded-xl border border-zinc-700 bg-zinc-950/50 px-3 py-2 shadow-sm transition-all"
                  >
                    <FileUp size={15} className="text-zinc-500 shrink-0" />

                    <div className="flex flex-col justify-center">
                      <span className="max-w-[160px] truncate text-xs font-medium text-zinc-200">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-1 shrink-0 rounded-md p-1 text-zinc-500 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs leading-relaxed text-zinc-500">
                You can select multiple files from different directories. Max 10MB per file. Allowed formats: PDF, DOC, DOCX, JPG, PNG.
              </p>
            </div>
          </section>

          {/* ERRORS & FEEDBACK */}
          {error && (
            <div className="rounded-xl border border-rose-900/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
              {error}
            </div>
          )}

          {saved && (
            <div className="rounded-xl border border-emerald-900/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              Tender created successfully. Redirecting to overview…
            </div>
          )}

          {/* ACTION BAR */}
          <div className="sticky bottom-3 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-3 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="px-1 text-xs text-zinc-500">
              Connected to local tender registry.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate("/sales")}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 sm:flex-none"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saved || isSubmitting}
                className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50 sm:flex-none"
              >
                <Check size={15} className="mr-1.5 inline" />
                {isSubmitting ? "Creating..." : "Save Tender"}
              </button>
            </div>
          </div>
        </form>

        <footer className="mt-8 border-t border-zinc-800 pt-5 text-xs text-zinc-500">
          Vikram Engineering · Tender desk
        </footer>
      </div>
    </main>
  );
}