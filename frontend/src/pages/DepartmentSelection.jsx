
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Wallet,
  Settings,
  Sparkles,
} from "lucide-react";

const departments = [
  {
    name: "Sales",
    description:
      "Manage tenders, clients, customer relationships and sales activities.",
    icon: BriefcaseBusiness,
    path: "/sales",
    label: "Sales Management",
  },
  {
    name: "Finance",
    description:
      "Manage accounts, transactions, budgets and financial records.",
    icon: Wallet,
    path: "/finance",
    label: "Financial Management",
  },
  {
    name: "Operations",
    description:
      "Manage project execution, purchase orders, quality control and operational workflows.",
    icon: Settings,
    path: "/operations",
    label: "Operations Management",
  },
];

function Reveal({ children, delay = 0, className = "" }) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`
        transition-all duration-700 ease-out
        motion-reduce:transition-none
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default function DepartmentSelection() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-48 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />
        <div className="absolute -bottom-48 -left-40 h-[450px] w-[450px] rounded-full bg-emerald-700/[0.06] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {/* Header */}
        <Reveal>
          <header className="flex items-center justify-between border-b border-zinc-800/80 pb-7">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/10">
                <Building2 size={25} strokeWidth={2.2} />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                  Vikram Engineering
                </h1>
                <p className="mt-1 text-[10px] font-semibold tracking-[0.24em] text-zinc-500 sm:text-xs">
                  ENTERPRISE RESOURCE PLANNING
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-zinc-400">
                Workspace Active
              </span>
            </div>
          </header>
        </Reveal>

        {/* Hero section */}
        <section className="pb-14 pt-16 sm:pb-20 sm:pt-24">
          <Reveal delay={100}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-2">
              <Sparkles size={14} className="text-emerald-400" />
              <span className="text-xs font-semibold tracking-wide text-emerald-400">
                YOUR CENTRAL WORKSPACE
              </span>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h2 className="max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
              Everything your business needs,{" "}
              <span className="text-emerald-400">
                in one place.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={300}>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Welcome to Vikram Engineering's ERP workspace. Select a
              department to access its dedicated tools, manage workflows
              and keep your business operations connected.
            </p>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-9 flex items-center gap-3 text-xs font-medium text-zinc-500">
              <span className="h-px w-8 bg-emerald-500/60" />
              SELECT A DEPARTMENT TO CONTINUE
            </div>
          </Reveal>
        </section>

        {/* Department cards */}
        <section className="grid gap-5 pb-16 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((department, index) => {
            const Icon = department.icon;

            return (
              <Reveal key={department.name} delay={index * 140}>
                <Link
                  to={department.path}
                  className="group relative block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950"
                >
                  <div className="relative flex h-full min-h-[290px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:border-emerald-500/50 group-hover:bg-zinc-900 group-hover:shadow-[0_20px_60px_-20px_rgba(16,185,129,0.18)] sm:p-7">
                    {/* Hover background glow */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/0 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/10" />

                    {/* Card top */}
                    <div className="relative mb-9 flex items-start justify-between">
                      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.08] text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/15">
                        <Icon size={25} strokeWidth={1.8} />
                      </div>

                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                        Available
                      </span>
                    </div>

                    {/* Card content */}
                    <div className="relative flex-1">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        {department.label}
                      </p>

                      <h3 className="text-xl font-semibold tracking-tight text-zinc-100 transition-colors group-hover:text-emerald-400">
                        {department.name}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-zinc-400">
                        {department.description}
                      </p>
                    </div>

                    {/* Card bottom */}
                    <div className="relative mt-8 flex items-center justify-between border-t border-zinc-800 pt-5 transition-colors group-hover:border-emerald-500/20">
                      <span className="text-sm font-semibold text-emerald-400">
                        Open Workspace
                      </span>

                      <div className="grid h-9 w-9 place-items-center rounded-full border border-zinc-700 text-zinc-400 transition-all duration-300 group-hover:border-emerald-500/40 group-hover:bg-emerald-500 group-hover:text-zinc-950">
                        <ArrowRight
                          size={17}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </section>

        {/* Footer */}
        <Reveal>
          <footer className="flex flex-col items-center justify-between gap-3 border-t border-zinc-800/80 py-7 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-sm font-semibold text-zinc-400">
                Vikram Engineering
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Enterprise Resource Planning System
              </p>
            </div>

            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} Vikram Engineering. All rights reserved.
            </p>
          </footer>
        </Reveal>
      </div>
    </main>
  );
}
