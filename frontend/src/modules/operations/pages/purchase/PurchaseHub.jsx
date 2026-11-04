
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  FolderOpen,
  ArrowRight,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import ProjectDetailsModal from "../../components/ProjectDetailsModal";
import operationsApi from "../../api/operations_api";

export default function PurchaseHub() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await operationsApi.get("/projects");

      console.log("Operations Projects Response:", response.data);

      if (response.data?.success && Array.isArray(response.data.data)) {
        setProjects(response.data.data);
      } else {
        setProjects([]);
        setError("Unexpected response received from the server.");
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      console.error("Server response:", err.response?.data);

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

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">

        {/* Header */}
        <header className="mb-12 border-b border-zinc-800 pb-8">
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
        </header>

        {/* Introduction */}
        <section className="mb-12">
          <p className="mb-3 text-sm font-medium tracking-widest text-emerald-400">
            PURCHASE WORKSPACE
          </p>

          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Active Projects
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            Select a project to view its details and manage purchase
            orders, materials, and related documents.
          </p>
        </section>

        {/* Loading */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : error ? (
          /* Error State */
          <div className="rounded-2xl border border-red-500/20 bg-zinc-900 px-6 py-12 text-center">
            <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-400" />

            <h3 className="text-lg font-semibold">
              Failed to Load Projects
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-400">
              {error}
            </p>

            <button
              onClick={fetchProjects}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-16 text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-xl bg-zinc-800 text-zinc-500">
              <FolderOpen size={26} />
            </div>

            <h3 className="text-lg font-semibold">
              No Active Projects
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
              There are currently no projects available in the purchase
              workspace.
            </p>
          </div>
        ) : (
          /* Project Cards */
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => setSelectedProjectId(project._id)}
                className="group flex cursor-pointer flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-zinc-900/80"
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Building2 size={23} />
                  </div>

                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    Active
                  </span>
                </div>

                <h3 className="text-lg font-semibold">
                  {project.projectName}
                </h3>

                <p className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                  <FolderOpen size={16} className="shrink-0" />
                  {project.client?.clientName || "Unknown Client"}
                </p>

                <div className="mt-8 flex items-center justify-between text-sm font-medium text-emerald-400">
                  <span>Open Project Vault</span>

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Project Details Modal */}
        {selectedProjectId && (
          <ProjectDetailsModal
            projectId={selectedProjectId}
            onClose={() => setSelectedProjectId(null)}
            onCreatePO={() =>
              navigate(
                `/operations/purchase/projects/${selectedProjectId}`
              )
            }
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
