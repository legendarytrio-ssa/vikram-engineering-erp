import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Loader2,
  FolderKanban,
  Building2,
  FileText,
  ShoppingCart,
  Wallet,
  Hash,
  ClipboardList,
  Plus,
  ArrowRight,
} from "lucide-react";

import operationsApi from "../api/operations_Api.js";

function Detail({ label, value }) {
  if (value === undefined || value === null || value === "") return null;

  const displayValue =
    typeof value === "object"
      ? JSON.stringify(value, null, 2)
      : String(value);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="break-words whitespace-pre-wrap text-sm text-zinc-200">
        {displayValue}
      </p>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <Icon size={19} className="text-emerald-400" />
        <h3 className="font-semibold text-white">{title}</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

export default function ProjectDetailsModal({ projectId, onClose }) {
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await operationsApi.get(`/projects/${projectId}`);

        if (response.data.success) {
          setProject(response.data.data);
        } else {
          setError("Unable to load project details.");
        }
      } catch (err) {
        console.error("Failed to fetch project details:", err);
        setError(
          err.response?.data?.message || "Failed to load project details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchProjectDetails();
  }, [projectId]);

  if (!projectId) return null;

 const handleCreatePO = () => {
  onClose();
  navigate(
    `/operations/purchase/projects/${projectId}/purchase-orders/new`
  );
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2.5">
              <FolderKanban className="text-emerald-400" size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Project Overview
              </h2>
              <p className="text-xs text-zinc-500">
                Complete project information
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <X size={21} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-zinc-400">
              <Loader2 size={22} className="animate-spin text-emerald-400" />
              Loading project information...
            </div>
          ) : error ? (
            <div className="py-16 text-center text-red-400">{error}</div>
          ) : project ? (
            <div className="space-y-8">

              {/* Project Heading */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-emerald-400">
                      {project.projectCode || "Project"}
                    </p>
                    <h3 className="text-xl font-bold text-white">
                      {project.projectName}
                    </h3>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    {project.status || "UNKNOWN"}
                  </span>
                </div>
              </div>

              {/* Basic Project Information */}
              <Section title="Basic Project Information" icon={FolderKanban}>
                <Detail label="Project Name" value={project.projectName} />
                <Detail label="Project Code" value={project.projectCode} />
                <Detail label="Project ID" value={project._id} />
                <Detail label="Status" value={project.status} />
                <Detail
                  label="Created At"
                  value={project.createdAt ? new Date(project.createdAt).toLocaleString() : null}
                />
                <Detail
                  label="Last Updated"
                  value={project.updatedAt ? new Date(project.updatedAt).toLocaleString() : null}
                />
                <Detail
                  label="Created By"
                  value={project.createdBy?._id || project.createdBy}
                />
              </Section>

              {/* Client Information */}
              <Section title="Client Information" icon={Building2}>
                <Detail label="Client Name" value={project.client?.clientName} />
                <Detail label="Contact Person" value={project.client?.contactPerson} />
                <Detail label="Client ID" value={project.client?._id} />
              </Section>

              {/* Tender Information */}
              <Section title="Tender Information" icon={FileText}>
                <Detail label="Tender Title" value={project.tender?.tenderTitle} />
                <Detail label="Tender Reference" value={project.tender?.tenderRef} />
                <Detail label="Tender ID" value={project.tender?._id} />
              </Section>

              {/* Sales Information */}
              <Section title="Sales Information" icon={ClipboardList}>
                <Detail
                  label="PO Description"
                  value={project.salesData?.poDescription}
                />
                <Detail
                  label="Sales Documents"
                  value={project.salesData?.documents?.length ?? 0}
                />
              </Section>

              {/* Operations Information */}
              <Section title="Operations Information" icon={ShoppingCart}>
                <Detail
                  label="QC Records"
                  value={project.qualityRecords?.length ?? 0}
                />
                <Detail
                  label="Purchase Records"
                  value={project.purchaseItems?.length ?? 0}
                />
                <Detail
                  label="QC Documents"
                  value={project.operationsData?.qcDocuments?.length ?? 0}
                />
                <Detail
                  label="Purchase Documents"
                  value={project.operationsData?.purchaseDocuments?.length ?? 0}
                />
              </Section>

              {/* Finance Information */}
              <Section title="Finance Information" icon={Wallet}>
                <Detail
                  label="Finance Documents"
                  value={project.financeData?.documents?.length ?? 0}
                />
              </Section>

              {/* Additional Information */}
              {project.others &&
                Object.keys(project.others).length > 0 && (
                  <Section title="Additional Information" icon={Hash}>
                    {Object.entries(project.others).map(([key, value]) => (
                      <Detail key={key} label={key} value={value} />
                    ))}
                  </Section>
                )}

              {/* Create Purchase Order */}
              <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-emerald-500/10 p-2.5">
                      <ShoppingCart className="text-emerald-400" size={22} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        Purchase Orders
                      </h3>
                      <p className="mt-1 text-sm text-zinc-400">
                        Create a new purchase order for this project.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCreatePO}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                  >
                    <Plus size={17} />
                    Create PO
                    <ArrowRight size={16} />
                  </button>
                </div>
              </section>

            </div>
          ) : (
            <p className="py-16 text-center text-zinc-500">
              Project information not found.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-zinc-800 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}