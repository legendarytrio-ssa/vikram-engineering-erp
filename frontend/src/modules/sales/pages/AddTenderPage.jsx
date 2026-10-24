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
  X,
} from "lucide-react";

import Header from "../components/landing/Header";
import FieldLabel from "../components/forms/FieldLabel";
import TextInput from "../components/forms/TextInput";
import salesApi from "../services/salesApi";

export default function AddTenderPage() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await salesApi.get("/clients/getClients");
      setClients(res.data);
    } catch (err) {
      console.error("Failed to load clients", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

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
      {
        id: crypto.randomUUID(),
        name: "",
        value: "",
      },
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

  async function saveCeo() {
    const name = ceoDraft.trim();

    if (!name || !selectedClient) return;

    try {
      await salesApi.post("/clients/createClients", {
        companyName: selectedCompany,
        ceos: [name],
      });

      await fetchClients();

      setCeoName(name);
      setCeoDraft("");
      setShowCeoEditor(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update CEO list.");
    }
  }

  async function submitTender(event) {
    event.preventDefault();
    setError("");

    if (!selectedCompany || !companyFound) {
      setError(
        "Choose a company from the database suggestions, or add it from Add Client first."
      );
      return;
    }

    if (!ceoName || !allowedCeos.includes(ceoName)) {
      setError(
        "Choose a CEO linked to the selected company."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await salesApi.post("/tenders/createTenders", {
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
      });

      setSaved(true);
      setTimeout(() => navigate("/sales"), 800);
    } catch (err) {
      setError(
        err.response?.data?.error ||
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
              NEW RECORD
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Add tender
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
              Create a tender record and link it to an existing client.
              Only the company and its registered CEO are required.
            </p>
          </div>

          <span className="w-fit rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400">
            Fields marked <span className="text-rose-500">*</span> are mandatory
          </span>
        </section>

        <form onSubmit={submitTender} className="relative space-y-5">
          {/* CLIENT DETAILS */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-zinc-800 pb-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Building2 size={18} />
              </span>

              <div>
                <h2 className="font-semibold text-zinc-100">
                  Client details
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Search your existing client records first.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="relative">
                <FieldLabel htmlFor="company" required>
                  Company name
                </FieldLabel>

                <div className="relative">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <TextInput
                    id="company"
                    value={companyQuery}
                    required
                    placeholder="Start typing a company name"
                    autoComplete="off"
                    className="pl-10"
                    onChange={(event) => {
                      setCompanyQuery(event.target.value);
                      setSelectedCompany("");
                      setCeoName("");
                      setShowCompanyOptions(true);
                      setError("");
                    }}
                    onFocus={() => setShowCompanyOptions(true)}
                  />
                </div>

                {showCompanyOptions &&
                  companyQuery.trim() &&
                  matches.length > 0 && (
                    <div className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-zinc-700 bg-zinc-800 p-1.5 shadow-2xl">
                      {matches.map((client) => (
                        <button
                          type="button"
                          key={client._id}
                          onClick={() => pickCompany(client)}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-zinc-700"
                        >
                          <span>
                            <span className="block text-sm font-medium text-zinc-200">
                              {client.companyName}
                            </span>

                            <span className="mt-0.5 block text-xs text-zinc-400">
                              {(client.ceos || []).length} registered CEO
                              {(client.ceos || []).length === 1 ? "" : "s"}
                            </span>
                          </span>

                          <ArrowUpRight
                            size={15}
                            className="text-zinc-500"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                {companyFound && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <Check size={13} />
                    Company found in client records
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
                  <FieldLabel htmlFor="ceo" required>
                    Company CEO
                  </FieldLabel>

                  {companyFound && (
                    <button
                      type="button"
                      onClick={() => {
                        setCeoDraft("");
                        setShowCeoEditor(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 transition hover:text-emerald-300 hover:underline"
                    >
                      <CirclePlus size={13} />
                      Update CEO list
                    </button>
                  )}
                </div>

                <div className="relative">
                  <select
                    id="ceo"
                    required
                    value={ceoName}
                    onChange={(event) =>
                      setCeoName(event.target.value)
                    }
                    disabled={
                      !companyFound || allowedCeos.length === 0
                    }
                    className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 pr-10 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {!companyFound
                        ? "Select a company first"
                        : allowedCeos.length
                        ? "Choose a registered CEO"
                        : "No CEO records yet"}
                    </option>

                    {allowedCeos.map((ceo) => (
                      <option key={ceo} value={ceo}>
                        {ceo}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
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
                    <h3 className="text-sm font-semibold text-zinc-200">
                      Update CEO list
                    </h3>

                    <p className="mt-1 text-xs text-zinc-400">
                      Add a CEO to {selectedCompany}.
                    </p>
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
                    onChange={(event) =>
                      setCeoDraft(event.target.value)
                    }
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
                  <p className="text-sm font-semibold text-zinc-200">
                    Client not in your records?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-400/80">
                    Register the company and CEO before creating its tender.
                  </p>
                </div>

                <Link
                  to="/sales/clients/new"
                  state={{
                    companyName: companyQuery.trim(),
                  }}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-emerald-500 hover:text-white"
                >
                  <Users size={15} />
                  Add Client
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </section>

          {/* TENDER INFORMATION */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-zinc-800 pb-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-300">
                <ClipboardList size={18} />
              </span>

              <div>
                <h2 className="font-semibold text-zinc-100">
                  Tender information
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Optional details can be filled in now or later.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="title">
                  Tender title
                </FieldLabel>

                <TextInput
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Plant maintenance contract"
                />
              </div>

              <div>
                <FieldLabel htmlFor="reference">
                  Tender / reference number
                </FieldLabel>

                <TextInput
                  id="reference"
                  value={referenceNo}
                  onChange={(e) =>
                    setReferenceNo(e.target.value)
                  }
                  placeholder="e.g. VE/2026/014"
                />
              </div>

              <div>
                <FieldLabel htmlFor="date">
                  Submission deadline
                </FieldLabel>

                <TextInput
                  id="date"
                  type="date"
                  value={submissionDate}
                  onChange={(e) =>
                    setSubmissionDate(e.target.value)
                  }
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor="notes">
                  Notes
                </FieldLabel>

                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  rows={3}
                  placeholder="Scope, requirements, or next steps…"
                  className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </section>

          {/* ADDITIONAL ATTRIBUTES */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-300">
                  <Settings2 size={18} />
                </span>

                <div>
                  <h2 className="font-semibold text-zinc-100">
                    Additional attributes
                  </h2>

                  <p className="mt-1 text-sm text-zinc-400">
                    Add custom fields for information specific to this tender.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addAttribute}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                <CirclePlus size={16} />
                Add Attribute
              </button>
            </div>

            {extraAttributes.length > 0 ? (
              <div className="mt-5 space-y-3">
                {extraAttributes.map((attribute, index) => (
                  <div
                    key={attribute.id}
                    className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end"
                  >
                    <div>
                      <FieldLabel
                        htmlFor={`attr-name-${attribute.id}`}
                      >
                        Attribute name
                      </FieldLabel>

                      <TextInput
                        id={`attr-name-${attribute.id}`}
                        value={attribute.name}
                        onChange={(e) =>
                          updateAttribute(
                            attribute.id,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder={
                          index === 0
                            ? "e.g. Estimated value"
                            : "Custom field"
                        }
                      />
                    </div>

                    <div>
                      <FieldLabel
                        htmlFor={`attr-value-${attribute.id}`}
                      >
                        Value
                      </FieldLabel>

                      <TextInput
                        id={`attr-value-${attribute.id}`}
                        value={attribute.value}
                        onChange={(e) =>
                          updateAttribute(
                            attribute.id,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder="Enter value"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExtraAttributes((current) =>
                          current.filter(
                            (item) =>
                              item.id !== attribute.id
                          )
                        )
                      }
                      className="grid h-11 w-11 place-items-center rounded-xl text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
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
            <p className="px-1 text-xs text-zinc-500">
              Connected to local database.
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
                <Check
                  size={15}
                  className="mr-1.5 inline"
                />
                {isSubmitting ? "Saving..." : "Save tender"}
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