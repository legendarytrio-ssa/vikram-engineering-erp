
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  FolderKanban,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  ArrowLeft,
  FileText,
  ClipboardCheck,
  Building2,
  ArrowRight,
} from "lucide-react";

import { fetchActiveProjects } from "../../services/operationServices";
import QCProjectModal from "../../components/QCProjectModal";

const StatCard = ({ title, value, icon: Icon, description }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm text-zinc-400">{title}</p>
      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
        <Icon size={19} />
      </div>
    </div>

    <h3 className="text-2xl font-bold text-zinc-100 mt-4">
      {value}
    </h3>

    {description && (
      <p className="text-xs text-zinc-500 mt-1">{description}</p>
    )}
  </div>
);

const ProjectCard = ({ project, onOpen }) => (
  <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-emerald-500/40 transition">
    <div className="flex items-start justify-between gap-3">
      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
        <FolderKanban size={22} />
      </div>

      <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        {project.status || "ACTIVE"}
      </span>
    </div>

    <div className="mt-5">
      <p className="text-xs text-zinc-500 font-medium tracking-wide">
        {project.projectCode || "NO PROJECT CODE"}
      </p>

      <h3 className="text-lg font-semibold text-zinc-100 mt-1 line-clamp-1">
        {project.projectName}
      </h3>
    </div>

    <div className="mt-5 space-y-3">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Building2 size={15} className="shrink-0" />
        <span className="truncate">
          {project.client?.clientName || "No client information"}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <FileText size={15} className="shrink-0" />
        <span className="truncate">
          {project.tender?.tenderTitle || "No tender information"}
        </span>
      </div>
    </div>

    <button
      onClick={onOpen}
      className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold transition"
    >
      Open QC Workspace
      <ArrowRight size={16} />
    </button>
  </div>
);

export default function QCDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Controls the QC project workspace modal.
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchActiveProjects();

      setProjects(data);
    } catch (err) {
      console.error("QC dashboard fetch error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to fetch active projects."
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
      const searchableText = [
        project.projectName,
        project.projectCode,
        project.client?.clientName,
        project.tender?.tenderTitle,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [projects, search]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate("/operations")}
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-400 transition mb-4"
            >
              <ArrowLeft size={16} />
              Back to Operations
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <ClipboardCheck size={25} />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Quality Control
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                  Manage project inspections, quality reports and documents.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchProjects}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm transition disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Active Projects"
            value={projects.length}
            icon={FolderKanban}
            description="Projects available for QC management"
          />

          <StatCard
            title="QC Reports"
            value="—"
            icon={FileText}
            description="Report aggregation not yet connected"
          />

          <StatCard
            title="Inspections"
            value="—"
            icon={ClipboardCheck}
            description="Inspection aggregation not yet connected"
          />
        </div>

        {/* Projects Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold">
                Active Projects
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Select a project to access its QC workspace.
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Loader2
                size={30}
                className="animate-spin text-emerald-400 mb-3"
              />
              <p className="text-sm">Loading active projects...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-8 text-center">
              <AlertCircle
                size={30}
                className="mx-auto text-red-400 mb-3"
              />

              <h3 className="text-zinc-200 font-semibold">
                Unable to load projects
              </h3>

              <p className="text-sm text-zinc-500 mt-2">
                {error}
              </p>

              <button
                onClick={fetchProjects}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm transition"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredProjects.length === 0 && (
            <div className="border border-dashed border-zinc-800 rounded-xl py-16 text-center">
              <FolderKanban
                size={34}
                className="mx-auto text-zinc-600 mb-3"
              />

              <h3 className="text-zinc-300 font-medium">
                {search
                  ? "No matching projects found"
                  : "No active projects available"}
              </h3>

              <p className="text-sm text-zinc-500 mt-2">
                {search
                  ? "Try searching with another project name or code."
                  : "Active projects will appear here once they are available."}
              </p>
            </div>
          )}

          {/* Project cards */}
          {!loading && !error && filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onOpen={() => setSelectedProjectId(project._id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* QC Project Workspace Modal */}
      {selectedProjectId && (
        <QCProjectModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
}
