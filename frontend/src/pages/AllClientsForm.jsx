import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Building2,
  Check,
  CirclePlus,
  Trash2,
  Users,
} from "lucide-react";

const CLIENTS_KEY = "vikram-erp-clients-v1";

function getClients() {
  try {
    return JSON.parse(localStorage.getItem(CLIENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function AllClientsForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [companyName, setCompanyName] = useState(
    location.state?.companyName || ""
  );

  const [ceos, setCeos] = useState([""]);
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [existing, setExisting] = useState(() => getClients());

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => navigate("/tenders/new"), 900);
    return () => clearTimeout(timer);
  }, [saved, navigate]);

  function updateCeo(index, value) {
    setCeos((current) => current.map((ceo, i) => (i === index ? value : ceo)));
  }

  function saveClient(event) {
    event.preventDefault();
    setError("");

    const company = companyName.trim();
    const cleanCeos = [...new Set(ceos.map((name) => name.trim()).filter(Boolean))];

    if (!company || cleanCeos.length === 0) {
      setError("Company name and at least one CEO are required.");
      return;
    }

    const allClients = getClients();
    const existingClient = allClients.find(
      (client) => client.companyName.toLowerCase() === company.toLowerCase()
    );

    let updated;

    if (existingClient) {
      updated = allClients.map((client) =>
        client.companyName === existingClient.companyName
          ? {
              ...client,
              ceos: [...new Set([...(client.ceos || []), ...cleanCeos])],
              contactEmail: contactEmail.trim() || client.contactEmail || "",
              phone: phone.trim() || client.phone || "",
              address: address.trim() || client.address || "",
              notes: notes.trim() || client.notes || "",
            }
          : client
      );
    } else {
      updated = [
        ...allClients,
        {
          companyName: company,
          ceos: cleanCeos,
          contactEmail: contactEmail.trim(),
          phone: phone.trim(),
          address: address.trim(),
          notes: notes.trim(),
          createdAt: new Date().toISOString(),
        },
      ];
    }

    localStorage.setItem(CLIENTS_KEY, JSON.stringify(updated));
    setExisting(updated);
    setSaved(true);
  }

  const duplicate =
    companyName.trim() &&
    existing.some((c) => c.companyName.toLowerCase() === companyName.trim().toLowerCase());

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-5 py-7 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-zinc-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
              <Building2 size={19} />
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
          <span className="w-fit rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300">
            CLIENT DIRECTORY
          </span>
        </header>

        <button
          onClick={() => navigate("/tenders/new")}
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
        >
          <ArrowLeft size={16} />
          Back to Add Tender
        </button>

        <section className="mb-8 mt-7">
          <p className="text-xs font-semibold tracking-[0.15em] text-emerald-500">
            CLIENT RECORD
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Add client
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Register the company and its CEO names here. Those records will be available in the tender form's real-time company search.
          </p>
        </section>

        <form onSubmit={saveClient} className="space-y-5">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-zinc-800 pb-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Users size={18} />
              </span>
              <div>
                <h2 className="font-semibold text-zinc-100">Company information</h2>
                <p className="mt-1 text-sm text-zinc-400">Company name and CEO are required.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-zinc-300">
                  Company name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="companyName"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter registered company name"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                />
                {duplicate && (
                  <p className="mt-2 text-xs text-amber-500">
                    This company already exists. Saving will add CEO names to its existing record.
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-zinc-300">
                    Company CEO <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCeos((c) => [...c, ""])}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 transition hover:text-emerald-300 hover:underline"
                  >
                    <CirclePlus size={14} /> Add another CEO
                  </button>
                </div>

                <div className="space-y-3">
                  {ceos.map((ceo, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        required={index === 0}
                        value={ceo}
                        onChange={(e) => updateCeo(index, e.target.value)}
                        placeholder={index === 0 ? "Enter CEO full name" : "Another CEO / authorised executive"}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                      />
                      {ceos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setCeos((c) => c.filter((_, i) => i !== index))}
                          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
                  Contact email <span className="text-xs font-normal text-zinc-500">(optional)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-zinc-300">
                  Contact phone <span className="text-xs font-normal text-zinc-500">(optional)</span>
                </label>
                <input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 ..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="mb-2 block text-sm font-medium text-zinc-300">
                  Registered address <span className="text-xs font-normal text-zinc-500">(optional)</span>
                </label>
                <input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, city, state"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="notes" className="mb-2 block text-sm font-medium text-zinc-300">
                  Notes <span className="text-xs font-normal text-zinc-500">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional client information…"
                  className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-xl border border-rose-900/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
              {error}
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-900/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              <Check size={16} /> Client saved. Returning to Add Tender…
            </div>
          )}

          <div className="sticky bottom-3 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-3 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="px-1 text-xs text-zinc-500">Prototype storage: this browser's local storage.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate("/tenders/new")}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 sm:flex-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saved}
                className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50 sm:flex-none"
              >
                <Check size={15} className="mr-1.5 inline" /> Save client
              </button>
            </div>
          </div>
        </form>

        <footer className="mt-8 border-t border-zinc-800 pt-5 text-xs text-zinc-500">
          Vikram Engineering · Client directory
        </footer>
      </div>
    </main>
  );
}