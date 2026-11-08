
import { useCallback, useEffect, useState } from "react";
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
  ChevronDown,
  Eye,
  Download,
  Package,
  RefreshCw,
} from "lucide-react";

import operationsApi from "../api/operations_Api.js";
import AddQCReportModal from "./AddQCReportModal";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  if (!date) return "Date unavailable";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatFileSize(bytes) {
  if (!bytes) return "Size unavailable";

  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(1)} KB`;
}

function getStatusColor(status) {
  switch (status) {
    case "DELIVERED":
    case "INVOICE_APPROVED":
      return "bg-emerald-500/10 text-emerald-400";

    case "DELIVERY_PENDING":
      return "bg-amber-500/10 text-amber-400";

    case "PO_ISSUED":
      return "bg-blue-500/10 text-blue-400";

    default:
      return "bg-zinc-700/50 text-zinc-300";
  }
}

function Detail({ label, value }) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

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

// --------------------------------------------------
// Document List
// --------------------------------------------------

function DocumentList({ documents, getDocumentUrl, parentId }) {
  if (!documents?.length) {
    return (
      <p className="text-xs text-zinc-500">
        No documents attached.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc._id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
        >
          <div className="min-w-0">
            <p className="break-all text-sm text-zinc-200">
              {doc.originalName || "Unnamed document"}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {doc.mimeType || "Unknown type"}
              {" · "}
              {formatFileSize(doc.size)}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <a
              href={getDocumentUrl(parentId, doc._id, "inline")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-emerald-400 transition hover:text-emerald-300"
            >
              <Eye size={16} />
              View
            </a>

            <a
              href={getDocumentUrl(parentId, doc._id, "attachment")}
              className="flex items-center gap-1.5 text-sm text-blue-400 transition hover:text-blue-300"
            >
              <Download size={16} />
              Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

// --------------------------------------------------
// Purchase Order Item
// --------------------------------------------------

function PurchaseOrderItem({ po, index, getDocumentUrl }) {
  return (
    <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-semibold text-white">
            Purchase Order #{index + 1}
          </h4>

          <p className="mt-1 text-xs text-zinc-500">
            {formatDate(po.createdAt)}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
            po.status
          )}`}
        >
          {po.status?.replaceAll("_", " ") || "UNKNOWN"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-zinc-500">Material</p>
          <p className="text-zinc-200">{po.materialName || "N/A"}</p>
        </div>

        <div>
          <p className="text-zinc-500">Vendor</p>
          <p className="text-zinc-200">{po.vendorName || "N/A"}</p>
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

      <div className="border-t border-zinc-800 pt-4">
        <p className="mb-3 text-sm font-medium text-zinc-300">
          Supporting Documents ({po.documents?.length || 0})
        </p>

        <DocumentList
          documents={po.documents}
          parentId={po._id}
          getDocumentUrl={getDocumentUrl}
        />
      </div>
    </div>
  );
}

// --------------------------------------------------
// QC Report Accordion Item
// --------------------------------------------------

function QCReportItem({ report, index, getDocumentUrl }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-zinc-800/70"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2.5">
            <ClipboardList size={20} className="text-emerald-400" />
          </div>

          <div className="min-w-0">
            <h4 className="truncate font-semibold text-white">
              {report.title || `QC Report #${index + 1}`}
            </h4>

            <p className="mt-1 text-xs text-zinc-500">
              {report.vendorName || "Vendor not specified"}
              {" · "}
              {formatDate(report.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 sm:block">
            {report.docs?.length || 0} documents
          </span>

          <ChevronDown
            size={19}
            className={`text-zinc-400 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {expanded && (
        <div className="space-y-5 border-t border-zinc-800 p-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Report Description
            </p>

            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
              {report.description || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Detail label="Report Title" value={report.title} />
            <Detail label="Vendor Name" value={report.vendorName} />
            <Detail label="Report ID" value={report._id} />
            <Detail
              label="Created At"
              value={
                report.createdAt
                  ? new Date(report.createdAt).toLocaleString()
                  : null
              }
            />
          </div>

          {report.customFields?.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-medium text-zinc-300">
                Additional Parameters
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {report.customFields.map((field, fieldIndex) => (
                  <Detail
                    key={field._id || fieldIndex}
                    label={field.name}
                    value={field.value}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-zinc-800 pt-4">
            <p className="mb-3 text-sm font-medium text-zinc-300">
              Report Documents ({report.docs?.length || 0})
            </p>

            <DocumentList
              documents={report.docs}
              parentId={report._id}
              getDocumentUrl={getDocumentUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------
// Main Modal
// --------------------------------------------------

export default function QCProjectModal({ projectId, onClose }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPurchaseOrders, setShowPurchaseOrders] = useState(false);
  const [showAddReport, setShowAddReport] = useState(false);

  // Fetch complete project details
  const fetchProject = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError("");

      const response = await operationsApi.get(`/projects/${projectId}`);

      if (!response.data.success) {
        throw new Error("Unable to load project details.");
      }

      setProject(response.data.data);
    } catch (err) {
      console.error("Failed to fetch project details:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to load project details."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (!projectId) return null;

  // --------------------------------------------------
  // Purchase Order Document URL
  // Same getUri() approach as ProjectDetailsModal.jsx
  // --------------------------------------------------

  const getPurchaseOrderDocumentUrl = (
    poId,
    documentId,
    disposition
  ) => {
    return operationsApi.getUri({
      url: `/projects/${projectId}/purchase-orders/${poId}/documents/${documentId}`,
      params: { disposition },
    });
  };

  // --------------------------------------------------
  // QC Report Document URL
  // Same approach, with QC-specific endpoint
  // --------------------------------------------------

  const getQCReportDocumentUrl = (
    reportId,
    documentId,
    disposition
  ) => {
    return operationsApi.getUri({
      url: `/projects/${projectId}/qc-reports/${reportId}/documents/${documentId}`,
      params: { disposition },
    });
  };

  const purchaseOrders = project?.purchaseItems || [];
  const qcReports = project?.qualityRecords || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
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
                QC Project Workspace
              </h2>
              <p className="text-xs text-zinc-500">
                Project information, purchase orders and QC reports
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
            <div className="py-16 text-center">
              <p className="text-red-400">{error}</p>

              <button
                onClick={fetchProject}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700"
              >
                <RefreshCw size={15} />
                Retry
              </button>
            </div>
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

                <Detail label="Client ID" value={project.client?._id} />
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
                  label="QC Reports"
                  value={qcReports.length}
                />

                <Detail
                  label="Purchase Records"
                  value={purchaseOrders.length}
                />

                <Detail
                  label="QC Documents"
                  value={qcReports.reduce(
                    (total, report) => total + (report.docs?.length || 0),
                    0
                  )}
                />

                <Detail
                  label="Purchase Documents"
                  value={purchaseOrders.reduce(
                    (total, po) => total + (po.documents?.length || 0),
                    0
                  )}
                />
              </Section>

              {/* Purchase Orders */}
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
                        Purchase Orders
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
                        <PurchaseOrderItem
                          key={po._id}
                          po={po}
                          index={index}
                          getDocumentUrl={getPurchaseOrderDocumentUrl}
                        />
                      ))
                    )}
                  </div>
                )}
              </section>

              {/* QC Reports */}
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-500/10 p-2.5">
                      <ClipboardList
                        size={21}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        Quality Control Reports
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        {qcReports.length} reports available
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddReport(true)}
                    className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                  >
                    <Plus size={17} />
                    Add QC Report
                  </button>
                </div>

                {qcReports.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 py-10 text-center">
                    <ClipboardList
                      size={30}
                      className="mx-auto mb-3 text-zinc-600"
                    />

                    <p className="text-sm font-medium text-zinc-300">
                      No QC reports yet
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Add a report to maintain this project's quality records.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {qcReports.map((report, index) => (
                      <QCReportItem
                        key={report._id}
                        report={report}
                        index={index}
                        getDocumentUrl={getQCReportDocumentUrl}
                      />
                    ))}
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

      {/* Add QC Report Modal */}
      {showAddReport && (
        <AddQCReportModal
          project={project}
          onClose={() => setShowAddReport(false)}
          onSuccess={async () => {
            setShowAddReport(false);
            await fetchProject();
          }}
        />
      )}
    </div>
  );
}
