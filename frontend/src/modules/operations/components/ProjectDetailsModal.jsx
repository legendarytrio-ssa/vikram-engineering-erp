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
  ChevronDown,
  Eye,
  Download,
  Package,
} from "lucide-react";


import { fetchProjectDetails } from "../services/operationServices.js";
import operationsApi from "../api/operations_api.js";

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

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatFileSize(bytes) {
  if (!bytes) return "Size unavailable";

  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(1)} KB`;
}

export default function ProjectDetailsModal({ projectId, onClose }) {
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPurchaseOrders, setShowPurchaseOrders] = useState(false);

  // Fetch project details through the service layer
  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchProjectDetails(projectId);

        setProject(data);
      } catch (err) {
        console.error("Failed to fetch project details:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load project details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProjectDetails();
    }
  }, [projectId]);

  if (!projectId) return null;

  const handleCreatePO = () => {
    onClose();

    navigate(
      `/operations/purchase/projects/${projectId}/purchase-orders/new`
    );
  };

  const purchaseOrders = project?.purchaseItems || [];

  // Generate backend document endpoint URLs
  const getDocumentUrl = (poId, documentId, disposition) => {
    return operationsApi.getUri({
      url: `/projects/${projectId}/purchase-orders/${poId}/documents/${documentId}`,
      params: { disposition },
    });
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
              <Loader2
                size={22}
                className="animate-spin text-emerald-400"
              />
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
                  value={
                    project.createdAt
                      ? new Date(project.createdAt).toLocaleString()
                      : null
                  }
                />

                <Detail
                  label="Last Updated"
                  value={
                    project.updatedAt
                      ? new Date(project.updatedAt).toLocaleString()
                      : null
                  }
                />

                <Detail
                  label="Created By"
                  value={project.createdBy?._id || project.createdBy}
                />
              </Section>

              {/* Client Information */}
              <Section title="Client Information" icon={Building2}>
                <Detail
                  label="Client Name"
                  value={project.client?.clientName}
                />

                <Detail
                  label="Contact Person"
                  value={project.client?.contactPerson}
                />

                <Detail
                  label="Client ID"
                  value={project.client?._id}
                />
              </Section>

              {/* Tender Information */}
              <Section title="Tender Information" icon={FileText}>
                <Detail
                  label="Tender Title"
                  value={project.tender?.tenderTitle}
                />

                <Detail
                  label="Tender Reference"
                  value={project.tender?.tenderRef}
                />

                <Detail
                  label="Tender ID"
                  value={project.tender?._id}
                />
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
                  value={purchaseOrders.length}
                />

                <Detail
                  label="QC Documents"
                  value={project.operationsData?.qcDocuments?.length ?? 0}
                />

                <Detail
                  label="Purchase Documents"
                  value={
                    project.operationsData?.purchaseDocuments?.length ?? 0
                  }
                />
              </Section>

              {/* See Purchase Orders */}
              <section className="space-y-4">
                <button
                  onClick={() =>
                    setShowPurchaseOrders((prev) => !prev)
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:bg-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <Package size={21} className="text-emerald-400" />

                    <div className="text-left">
                      <h3 className="font-semibold text-white">
                        See Purchase Orders
                      </h3>

                      <p className="mt-1 text-sm text-zinc-400">
                        {purchaseOrders.length} purchase orders
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    size={20}
                    className={`text-zinc-400 transition-transform ${
                      showPurchaseOrders ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showPurchaseOrders && (
                  <div className="space-y-4">
                    {purchaseOrders.length === 0 ? (
                      <p className="py-6 text-center text-sm text-zinc-500">
                        No purchase orders found for this project.
                      </p>
                    ) : (
                      purchaseOrders.map((po, index) => (
                        <div
                          key={po._id}
                          className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4"
                        >
                          {/* PO Header */}
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <h4 className="font-semibold text-white">
                                Purchase Order #{index + 1}
                              </h4>

                              <p className="mt-1 text-xs text-zinc-500">
                                {po.createdAt
                                  ? new Date(
                                      po.createdAt
                                    ).toLocaleDateString()
                                  : "Date unavailable"}
                              </p>
                            </div>

                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                              {po.status?.replaceAll("_", " ") || "UNKNOWN"}
                            </span>
                          </div>

                          {/* PO Details */}
                          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                            <div>
                              <p className="text-zinc-500">Material</p>
                              <p className="text-zinc-200">
                                {po.materialName || "N/A"}
                              </p>
                            </div>

                            <div>
                              <p className="text-zinc-500">Vendor</p>
                              <p className="text-zinc-200">
                                {po.vendorName || "N/A"}
                              </p>
                            </div>

                            <div>
                              <p className="text-zinc-500">Quantity</p>
                              <p className="text-zinc-200">
                                {po.quantity ?? "N/A"} {po.uom || ""}
                              </p>
                            </div>

                            <div>
                              <p className="text-zinc-500">Unit Rate</p>
                              <p className="text-zinc-200">
                                {formatCurrency(po.unitRate)}
                              </p>
                            </div>

                            <div>
                              <p className="text-zinc-500">Total Cost</p>
                              <p className="font-semibold text-emerald-400">
                                {formatCurrency(po.totalCost)}
                              </p>
                            </div>
                          </div>

                          {/* Supporting Documents */}
                          <div className="border-t border-zinc-800 pt-4">
                            <p className="mb-3 text-sm font-medium text-zinc-300">
                              Supporting Documents (
                              {po.documents?.length || 0})
                            </p>

                            {!po.documents?.length ? (
                              <p className="text-xs text-zinc-500">
                                No documents attached.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {po.documents.map((doc) => (
                                  <div
                                    key={doc._id}
                                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                                  >
                                    <div className="min-w-0">
                                      <p className="break-all text-sm text-zinc-200">
                                        {doc.originalName}
                                      </p>

                                      <p className="mt-1 text-xs text-zinc-500">
                                        {doc.mimeType || "Unknown type"}
                                        {" · "}
                                        {formatFileSize(doc.size)}
                                      </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-4">
                                      {/* View Document */}
                                      <a
                                        href={getDocumentUrl(
                                          po._id,
                                          doc._id,
                                          "inline"
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-sm text-emerald-400 transition hover:text-emerald-300"
                                      >
                                        <Eye size={16} />
                                        View
                                      </a>

                                      {/* Download Document */}
                                      <a
                                        href={getDocumentUrl(
                                          po._id,
                                          doc._id,
                                          "attachment"
                                        )}
                                        className="flex items-center gap-1.5 text-sm text-blue-400 transition hover:text-blue-300"
                                      >
                                        <Download size={16} />
                                        Download
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </section>

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