
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  FolderKanban,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  ArrowLeft,
  FileText,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

import ProjectDetailsModal from "../../components/ProjectDetailsModal.jsx";
import OperationsChatModal from "../../components/OperationsChatModal.jsx";
import { fetchActiveProjects } from "../../services/operationServices";

function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">{title}</p>

        <div className="rounded-lg bg-emerald-500/10 p-2">
          <Icon size={19} className="text-emerald-400" />
        </div>
      </div>

      <h3 className="mt-4 text-3xl font-semibold text-white">
        {value}
      </h3>

      <p className="mt-1 text-xs text-zinc-500">{description}</p>
    </div>
  );
}

function ProjectCard({ project, onOpen, onChat }) {
  return (
    <div className="group rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-emerald-500/40 hover:bg-zinc-900/80">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wider text-emerald-400">
            {project.projectCode || "PROJECT"}
          </p>

          <h3 className="mt-2 truncate text-lg font-semibold text-white">
            {project.projectName}
          </h3>
        </div>

        <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          {project.status || "ACTIVE"}
        </span>
      </div>

      <div className="mt-5 space-y-3 border-t border-zinc-800 pt-4">
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <Building2 size={16} className="shrink-0 text-zinc-500" />
          <span className="truncate">
            {project.client?.clientName || "Unknown Client"}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <FileText size={16} className="shrink-0 text-zinc-500" />
          <span className="truncate">
            {project.tender?.tenderTitle || "No tender information"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => onOpen(project)}
          className="flex min-w-0 flex-1 items-center justify-between rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-400"
        >
          <span>Project Vault</span>

          <ArrowRight
            size={16}
            className="shrink-0 transition-transform group-hover:translate-x-1"
          />
        </button>

        <button
          type="button"
          onClick={() => onChat(project)}
          disabled={!project.projectCode}
          title="Open project chat"
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <MessageSquare size={17} />
          Chat
        </button>
      </div>
    </div>
  );
}

export default function PurchaseHub() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [chatProject, setChatProject] = useState(null);

  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchActiveProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch purchase projects:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to fetch projects."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return projects;

    return projects.filter((project) => {
      return (
        project.projectName?.toLowerCase().includes(query) ||
        project.projectCode?.toLowerCase().includes(query) ||
        project.client?.clientName?.toLowerCase().includes(query) ||
        project.tender?.tenderTitle?.toLowerCase().includes(query)
      );
    });
  }, [projects, search]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

        {/* Header */}
        <header className="mb-10 flex flex-wrap items-center justify-between gap-5 border-b border-zinc-800 pb-7">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-600">
              <Building2 size={24} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Vikram Engineering
              </h1>

              <p className="mt-1 text-xs tracking-[0.2em] text-zinc-500">
                OPERATIONS / PURCHASE
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/operations")}
            className="flex items-center gap-2 rounded-lg border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white"
          >
            <ArrowLeft size={16} />
            Operations
          </button>
        </header>

        {/* Introduction */}
        <section className="mb-9">
          <p className="mb-3 text-sm font-medium tracking-widest text-emerald-400">
            PURCHASE WORKSPACE
          </p>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Purchase Dashboard
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Manage project materials, purchase orders, vendor
                information, and related procurement documents.
              </p>
            </div>

            <button
              onClick={fetchProjects}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-900 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Active Projects"
            value={loading ? "—" : projects.length}
            description="Projects available for procurement"
            icon={FolderKanban}
          />

          <StatCard
            title="Purchase Orders"
            value="—"
            description="Purchase order tracking"
            icon={FileText}
          />

          <StatCard
            title="Vendors"
            value="—"
            description="Vendor tracking"
            icon={Building2}
          />
        </section>

        {/* Projects */}
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Active Projects
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Select a project to view its details and manage purchase orders.
              </p>
            </div>

            <span className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400">
              {loading ? "Loading..." : `${filteredProjects.length} Projects`}
            </span>
          </div>

          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project, code, client..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-500/50"
            />
          </div>

          {/* Loading / Error / Projects */}
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 py-20">
              <Loader2
                size={28}
                className="animate-spin text-emerald-400"
              />

              <p className="mt-4 text-sm text-zinc-400">
                Loading active projects...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 py-14 text-center">
              <AlertCircle
                size={30}
                className="mx-auto text-red-400"
              />

              <p className="mt-3 text-sm text-red-400">{error}</p>

              <button
                onClick={fetchProjects}
                className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white transition hover:bg-zinc-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 py-16 text-center">
              <FolderKanban
                size={32}
                className="mx-auto text-zinc-600"
              />

              <h4 className="mt-4 font-medium text-zinc-300">
                {search ? "No matching projects" : "No active projects"}
              </h4>

              <p className="mt-2 text-sm text-zinc-500">
                {search
                  ? "Try changing your search keywords."
                  : "Active projects will appear here when they are available."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onOpen={(selectedProject) =>
                    setSelectedProjectId(selectedProject._id)
                  }
                  onChat={(selectedProject) =>
                    setChatProject(selectedProject)
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* Project Details Modal */}
        {selectedProjectId && (
          <ProjectDetailsModal
            projectId={selectedProjectId}
            onClose={() => setSelectedProjectId(null)}
          />
        )}

        {/* Operations Chat Modal */}
        {chatProject && (
          <OperationsChatModal
            project={chatProject}
            onClose={() => setChatProject(null)}
          />
        )}

        {/* Footer */}
        <footer className="mt-16 border-t border-zinc-800 pt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} Vikram Engineering. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
