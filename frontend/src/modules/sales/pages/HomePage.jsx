import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowUpRight,
  ClipboardList,
  FilePlus2,
  Sparkles,
  Users,
} from "lucide-react";

import Header from "../components/landing/Header";
import Metric from "../components/landing/Metric";
import salesApi from "../services/salesApi";

export default function HomePage() {
  const navigate = useNavigate();

  const [tenders, setTenders] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    salesApi
      .get("/tenders/getTenders")
      .then((res) => setTenders(res.data))
      .catch(console.error);

    salesApi
      .get("/clients/getClients")
      .then((res) => setClients(res.data))
      .catch(console.error);
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
              Keep tender details, client contacts, and the next steps
              in one quiet, organised workspace.
            </p>

            <button
              onClick={() => navigate("/sales/tenders/new")}
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

              <ClipboardList
                size={18}
                className="text-zinc-500"
              />
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
                  to="/sales/clients/new"
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
                When you add a tender, it will appear here for quick access.
              </p>

              <button
                onClick={() => navigate("/sales/tenders/new")}
                className="mt-5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Create your first tender →
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
              {tenders.map((tender, index) => (
                <div
                  key={tender._id}
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
          <span>
            Vikram Engineering · Internal workspace
          </span>

          <span>
            Client-linked tender records
          </span>
        </footer>
      </div>
    </main>
  );
}