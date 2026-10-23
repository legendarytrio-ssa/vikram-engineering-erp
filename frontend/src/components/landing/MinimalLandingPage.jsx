import { useEffect, useMemo, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  CirclePlus,
  ClipboardList,
  FilePlus2,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";

import AllClientsForm from "../../pages/AllClientsForm";

const CLIENTS_KEY = "vikram-erp-clients-v1";
const TENDERS_KEY = "vikram-erp-tenders-v1";

function readStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

/* Shared header */

function Brand() {
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

function Header({ eyebrow = "TENDER MANAGEMENT" }) {
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

/* Homepage */

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-800 p-4">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
        {value}
      </p>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();

  const [tenders, setTenders] = useState(() =>
    readStorage(TENDERS_KEY)
  );

  const [clients] = useState(() =>
    readStorage(CLIENTS_KEY)
  );

  useEffect(() => {
    const sync = () => setTenders(readStorage(TENDERS_KEY));
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 lg:px-10">
        <Header eyebrow="OVERVIEW" />

        <section className="grid gap-10 pb-14 pt-12 md:grid-cols-[1.3fr_0.7fr] md:items-end md:pt-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300">
              <Sparkles size={13} className="text-emerald-400" />
              Your tender desk
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.1] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Good work starts with a{" "}
              <span className="text-emerald-400">
                clear record.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
              Keep tender details, client contacts, and the next
              steps in one quiet, organised workspace.
            </p>

            <button
              onClick={() => navigate("/tenders/new")}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
            >
              <FilePlus2 size={17} />
              Add Tender
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">
                Workspace snapshot
              </span>
              <ClipboardList size={18} className="text-zinc-500" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Metric
                label="Tenders saved"
                value={tenders.length}
              />
              <Metric
                label="Client records"
                value={clients.length}
              />
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-zinc-950 p-4">
              <span className="mt-0.5 rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                <Users size={16} />
              </span>

              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  Start with your client list
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  Company and CEO records power the linked fields
                  in each tender.
                </p>

                <Link
                  to="/clients/new"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                >
                  Add a client
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800 pt-7">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] text-zinc-500">
                RECENT ACTIVITY
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-100">
                Your tenders
              </h2>
            </div>

            <span className="text-xs text-zinc-500">
              {tenders.length} total
            </span>
          </div>

          {tenders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 px-5 py-12 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <ClipboardList size={21} />
              </span>

              <h3 className="mt-4 text-sm font-semibold text-zinc-200">
                No tenders yet
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-zinc-400">
                When you add a tender, it will appear here for
                quick access.
              </p>

              <button
                onClick={() => navigate("/tenders/new")}
                className="mt-5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Create your first tender →
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
              {tenders
                .slice()
                .reverse()
                .map((tender, index) => (
                  <div
                    key={tender.id}
                    className={`flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
                      index ? "border-t border-zinc-800" : ""
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">
                        {tender.title || "Untitled tender"}
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        {tender.companyName} · {tender.ceoName}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                      Draft
                    </span>
                  </div>
                ))}
            </div>
          )}
        </section>

        <footer className="mt-12 flex flex-col gap-2 border-t border-zinc-800 pt-5 text-xs text-zinc-500 sm:flex-row sm:justify-between">
          <span>Vikram Engineering · Internal workspace</span>
          <span>Client-linked tender records</span>
        </footer>
      </div>
    </main>
  );
}

/* Shared form fields */

function FieldLabel({ children, required = false, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-zinc-300"
    >
      {children}
      {required && (
        <span className="ml-1 text-rose-500">*</span>
      )}
    </label>
  );
}

function TextInput({
  id,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
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
      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
    />
  );
}

/* Add Tender page */

export function AddTenderPage() {
  const navigate = useNavigate();

  const [clients, setClients] = useState(() =>
    readStorage(CLIENTS_KEY)
  );

  const [companyQuery, setCompanyQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [ceoName, setCeoName] = useState("");
  const [showCompanyOptions, setShowCompanyOptions] = useState(false);

  const [showCeoEditor, setShowCeoEditor] = useState(false);
  const [ceoDraft, setCeoDraft] = useState("");

  const [title, setTitle] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [notes, setNotes] = useState("");

  const [extraAttributes, setExtraAttributes] = useState([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const matches = useMemo(() => {
    const query = companyQuery.trim().toLowerCase();
    if (!query) return [];
    return clients.filter((client) =>
      client.companyName.toLowerCase().includes(query)
    );
  }, [clients, companyQuery]);

  const companyFound =
    selectedCompany &&
    clients.some(
      (client) => client.companyName === selectedCompany
    );

  const selectedClient = clients.find(
    (client) => client.companyName === selectedCompany
  );

  const allowedCeos = selectedClient?.ceos || [];

  const noCompanyMatch =
    companyQuery.trim().length > 0 && matches.length === 0;

  function pickCompany(company) {
    setSelectedCompany(company.companyName);
    setCompanyQuery(company.companyName);
    setCeoName("");
    setShowCompanyOptions(false);
    setError("");
  }

  function addAttribute() {
    setExtraAttributes((current) => [
      ...current,
      { id: crypto.randomUUID(), name: "", value: "" },
    ]);
  }

  function updateAttribute(id, field, value) {
    setExtraAttributes((current) =>
      current.map((attribute) =>
        attribute.id === id
          ? { ...attribute, [field]: value }
          : attribute
      )
    );
  }

  function saveCeo() {
    const name = ceoDraft.trim();
    if (!name || !selectedClient) return;

    const updatedClients = clients.map((client) =>
      client.companyName === selectedCompany
        ? {
            ...client,
            ceos: [...new Set([...(client.ceos || []), name])],
          }
        : client
    );

    localStorage.setItem(CLIENTS_KEY, JSON.stringify(updatedClients));
    setClients(updatedClients);
    setCeoName(name);
    setCeoDraft("");
    setShowCeoEditor(false);
  }

  function submitTender(event) {
    event.preventDefault();
    setError("");

    if (!selectedCompany || !companyFound) {
      setError("Choose a company from the database suggestions, or add it from Add Client first.");
      return;
    }

    if (!ceoName || !allowedCeos.includes(ceoName)) {
      setError("Choose a CEO linked to the selected company.");
      return;
    }

    const tender = {
      id: crypto.randomUUID(),
      companyName: selectedCompany,
      ceoName,
      title: title.trim(),
      referenceNo: referenceNo.trim(),
      submissionDate,
      notes: notes.trim(),
      attributes: extraAttributes
        .filter((attribute) => attribute.name.trim())
        .map(({ name, value }) => ({
          name: name.trim(),
          value: value.trim(),
        })),
      createdAt: new Date().toISOString(),
    };

    const allTenders = readStorage(TENDERS_KEY);
    localStorage.setItem(TENDERS_KEY, JSON.stringify([...allTenders, tender]));
    setSaved(true);
    setTimeout(() => navigate("/"), 800);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 lg:px-10">
        <Header />

        <button
          onClick={() => navigate("/")}
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
        >
          <ArrowLeft size={16} />
          Back to overview
        </button>

        <section className="mb-8 mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] text-emerald-500">
              NEW RECORD
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Add tender
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
              Create a tender record and link it to an existing
              client. Only the company and its registered CEO
              are required.
            </p>
          </div>

          <span className="w-fit rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400">
            Fields marked <span className="text-rose-500">*</span> are mandatory
          </span>
        </section>

        <form onSubmit={submitTender} className="space-y-5 relative">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-zinc-800 pb-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Building2 size={18} />
              </span>

              <div>
                <h2 className="font-semibold text-zinc-100">Client details</h2>
                <p className="mt-1 text-sm text-zinc-400">Search your existing client records first.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="relative">
                <FieldLabel htmlFor="company" required>Company name</FieldLabel>

                <div className="relative">
                  <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <TextInput
                    id="company"
                    value={companyQuery}
                    required
                    placeholder="Start typing a company name"
                    autoComplete="off"
                    onChange={(event) => {
                      setCompanyQuery(event.target.value);
                      setSelectedCompany("");
                      setCeoName("");
                      setShowCompanyOptions(true);
                      setError("");
                    }}
                    onFocus={() => setShowCompanyOptions(true)}
                    className="pl-10"
                  />
                </div>

                {showCompanyOptions && companyQuery.trim() && matches.length > 0 && (
                  <div className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-zinc-700 bg-zinc-800 p-1.5 shadow-2xl">
                    {matches.map((client) => (
                      <button
                        type="button"
                        key={client.companyName}
                        onClick={() => pickCompany(client)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-zinc-700"
                      >
                        <span>
                          <span className="block text-sm font-medium text-zinc-200">{client.companyName}</span>
                          <span className="mt-0.5 block text-xs text-zinc-400">
                            {(client.ceos || []).length} registered CEO
                            {(client.ceos || []).length === 1 ? "" : "s"}
                          </span>
                        </span>
                        <ArrowUpRight size={15} className="text-zinc-500" />
                      </button>
                    ))}
                  </div>
                )}

                {companyFound && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <Check size={13} /> Company found in client records
                  </p>
                )}

                {noCompanyMatch && (
                  <p className="mt-2 text-xs text-amber-500">
                    No matching company found. Add a client record to continue.
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <FieldLabel htmlFor="ceo" required>Company CEO</FieldLabel>

                  {companyFound && (
                    <button
                      type="button"
                      onClick={() => {
                        setCeoDraft("");
                        setShowCeoEditor(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 transition hover:text-emerald-300 hover:underline"
                    >
                      <CirclePlus size={13} /> Update CEO list
                    </button>
                  )}
                </div>

                <div className="relative">
                  <select
                    id="ceo"
                    required
                    value={ceoName}
                    onChange={(event) => setCeoName(event.target.value)}
                    disabled={!companyFound || allowedCeos.length === 0}
                    className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 pr-10 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" className="text-zinc-500">
                      {!companyFound
                        ? "Select a company first"
                        : allowedCeos.length
                          ? "Choose a registered CEO"
                          : "No CEO records yet"}
                    </option>
                    {allowedCeos.map((ceo) => (
                      <option key={ceo} value={ceo}>{ceo}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                </div>

                {companyFound && allowedCeos.length === 0 && (
                  <p className="mt-2 text-xs text-zinc-400">
                    Add a CEO to this client before saving the tender.
                  </p>
                )}
              </div>
            </div>

            {showCeoEditor && (
              <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-200">Update CEO list</h3>
                    <p className="mt-1 text-xs text-zinc-400">Add a CEO to {selectedCompany}.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCeoEditor(false)}
                    className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-300"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <TextInput
                    value={ceoDraft}
                    onChange={(event) => setCeoDraft(event.target.value)}
                    placeholder="Enter CEO full name"
                  />
                  <button
                    type="button"
                    onClick={saveCeo}
                    className="shrink-0 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                  >
                    Add CEO
                  </button>
                </div>
              </div>
            )}

            {noCompanyMatch && (
              <div className="mt-5 flex flex-col gap-3 rounded-xl border border-amber-900/50 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-200">Client not in your records?</p>
                  <p className="mt-1 text-xs leading-5 text-amber-400/80">
                    Register the company and CEO before creating its tender.
                  </p>
                </div>
                <Link
                  to="/clients/new"
                  state={{ companyName: companyQuery.trim() }}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-emerald-500 hover:text-white"
                >
                  <Users size={15} /> Add Client <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-zinc-800 pb-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-300">
                <ClipboardList size={18} />
              </span>
              <div>
                <h2 className="font-semibold text-zinc-100">Tender information</h2>
                <p className="mt-1 text-sm text-zinc-400">Optional details can be filled in now or later.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="title">Tender title</FieldLabel>
                <TextInput id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Plant maintenance contract" />
              </div>
              <div>
                <FieldLabel htmlFor="reference">Tender / reference number</FieldLabel>
                <TextInput id="reference" value={referenceNo} onChange={(e) => setReferenceNo(e.target.value)} placeholder="e.g. VE/2026/014" />
              </div>
              <div>
                <FieldLabel htmlFor="date">Submission deadline</FieldLabel>
                <TextInput id="date" type="date" value={submissionDate} onChange={(e) => setSubmissionDate(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <FieldLabel htmlFor="notes">Notes</FieldLabel>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Scope, requirements, or next steps…"
                  className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-300">
                  <Settings2 size={18} />
                </span>
                <div>
                  <h2 className="font-semibold text-zinc-100">Additional attributes</h2>
                  <p className="mt-1 text-sm text-zinc-400">Add custom fields for information specific to this tender.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addAttribute}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                <CirclePlus size={16} /> Add Attribute
              </button>
            </div>

            {extraAttributes.length > 0 && (
              <div className="mt-5 space-y-3">
                {extraAttributes.map((attribute, index) => (
                  <div key={attribute.id} className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end">
                    <div>
                      <FieldLabel htmlFor={`attr-name-${attribute.id}`}>Attribute name</FieldLabel>
                      <TextInput id={`attr-name-${attribute.id}`} value={attribute.name} onChange={(e) => updateAttribute(attribute.id, "name", e.target.value)} placeholder={index === 0 ? "e.g. Estimated value" : "Custom field"} />
                    </div>
                    <div>
                      <FieldLabel htmlFor={`attr-value-${attribute.id}`}>Value</FieldLabel>
                      <TextInput id={`attr-value-${attribute.id}`} value={attribute.value} onChange={(e) => updateAttribute(attribute.id, "value", e.target.value)} placeholder="Enter value" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setExtraAttributes((current) => current.filter((item) => item.id !== attribute.id))}
                      className="grid h-11 w-11 place-items-center rounded-xl text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {extraAttributes.length === 0 && (
              <p className="mt-5 rounded-xl border border-dashed border-zinc-800 px-4 py-5 text-center text-sm text-zinc-500">
                No custom attributes added.
              </p>
            )}
          </section>

          {error && (
            <div className="rounded-xl border border-rose-900/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
              {error}
            </div>
          )}

          {saved && (
            <div className="rounded-xl border border-emerald-900/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              Tender saved. Returning to overview…
            </div>
          )}

          <div className="sticky bottom-3 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-3 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="px-1 text-xs text-zinc-500">Saved locally for this prototype.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 sm:flex-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saved}
                className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50 sm:flex-none"
              >
                <Check size={15} className="mr-1.5 inline" /> Save tender
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