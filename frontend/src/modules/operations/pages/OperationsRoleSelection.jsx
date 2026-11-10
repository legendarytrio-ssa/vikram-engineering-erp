
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShoppingCart,
  Microscope,
  Settings,
  Building2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const operationsRoles = [
  {
    name: "Purchase Department",
    label: "Procurement & Materials",
    description:
      "Manage project materials, create purchase orders, coordinate with vendors, and handle procurement documents.",
    icon: ShoppingCart,
    path: "purchase",
    available: true,
  },
  {
    name: "Quality Control",
    label: "Inspection & Quality",
    description:
      "Manage site inspections, verify material quality, maintain quality records, and generate QC reports.",
    icon: Microscope,
    path: "qc",
    available: true,
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

export default function OperationsRoleSelection() {
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
                  OPERATIONS DEPARTMENT
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

        {/* Back navigation */}
        <Reveal delay={100}>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-emerald-400"
          >
            <ArrowLeft size={16} />
            Back to Departments
          </Link>
        </Reveal>

        {/* Hero section */}
        <section className="pb-14 pt-12 sm:pb-20 sm:pt-16">
          <Reveal delay={150}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-2">
              <Sparkles size={14} className="text-emerald-400" />
              <span className="text-xs font-semibold tracking-wide text-emerald-400">
                OPERATIONS WORKSPACE
              </span>
            </div>
          </Reveal>

          <Reveal delay={250}>
            <h2 className="max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
              Streamline your{" "}
              <span className="text-emerald-400">
                operations.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={350}>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Choose your operational workspace to manage procurement,
              materials, inspections and project quality workflows from
              one centralized platform.
            </p>
          </Reveal>

          <Reveal delay={450}>
            <div className="mt-9 flex items-center gap-3 text-xs font-medium text-zinc-500">
              <span className="h-px w-8 bg-emerald-500/60" />
              SELECT AN OPERATIONS WORKSPACE
            </div>
          </Reveal>
        </section>

        {/* Role cards */}
        <section className="grid gap-6 pb-16 sm:grid-cols-2">
          {operationsRoles.map((role, index) => {
            const Icon = role.icon;

            return (
              <Reveal key={role.name} delay={index * 160}>
                <Link
                  to={role.path}
                  className="group relative block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950"
                >
                  <div className="relative flex h-full min-h-[310px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:border-emerald-500/50 group-hover:bg-zinc-900 group-hover:shadow-[0_20px_60px_-20px_rgba(16,185,129,0.18)] sm:p-8">
                    {/* Hover glow */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/0 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/10" />

                    {/* Card top */}
                    <div className="relative mb-10 flex items-start justify-between">
                      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.08] text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/15">
                        <Icon size={29} strokeWidth={1.8} />
                      </div>

                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                        Available
                      </span>
                    </div>

                    {/* Card content */}
                    <div className="relative flex-1">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        {role.label}
                      </p>

                      <h3 className="text-xl font-semibold tracking-tight text-zinc-100 transition-colors group-hover:text-emerald-400 sm:text-2xl">
                        {role.name}
                      </h3>

                      <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-400">
                        {role.description}
                      </p>
                    </div>

                    {/* Card bottom */}
                    <div className="relative mt-9 flex items-center justify-between border-t border-zinc-800 pt-5 transition-colors group-hover:border-emerald-500/20">
                      <span className="text-sm font-semibold text-emerald-400">
                        Enter Workspace
                      </span>

                      <div className="grid h-10 w-10 place-items-center rounded-full border border-zinc-700 text-zinc-400 transition-all duration-300 group-hover:border-emerald-500/40 group-hover:bg-emerald-500 group-hover:text-zinc-950">
                        <ArrowRight
                          size={18}
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
