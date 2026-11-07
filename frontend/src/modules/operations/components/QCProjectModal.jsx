import { useCallback, useEffect, useState } from "react";
import {
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
  FolderKanban,
  Building2,
  FileText,
  ShoppingCart,
  Plus,
  Download,
  Eye,
  ClipboardCheck,
  CalendarDays,
  Package,
} from "lucide-react";

import operationsApi from "../api/operations_api";
import AddQCReportModal from "./AddQCReportModal";


const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "—";

  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

const Detail = ({ label, value }) => (
  <div className="min-w-0">
    <p className="text-xs text-zinc-500 mb-1">{label}</p>
    <p className="text-sm text-zinc-200 break-words">{value || "—"}</p>
  </div>
);

const SectionHeading = ({ icon: Icon, title, count, action }) => (
  <div className="flex items-center justify-between gap-3 mb-4">
    <div className="flex items-center gap-2">
      <Icon size={18} className="text-emerald-400" />
      <h3 className="font-semibold text-zinc-100">{title}</h3>
      {typeof count === "number" && (
        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </div>
    {action}
  </div>
);

export default function QCProjectModal({ projectId, onClose }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await operationsApi.get(`/projects/${projectId}`);

      if (!response.data?.success) {
        throw new Error("Unable to fetch project details.");
      }

      setProject(response.data.data);
    } catch (err) {
      console.error("QC project fetch error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to load project details."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const purchaseOrders = project?.purchaseItems || [];

  // Use qcReports for the new QC Report model.
  // qualityRecords is retained as a fallback for your existing QC data.
  const qcReports = project?.qcReports || project?.qualityRecords || [];

  const getDocumentUrl = (poId, documentId, disposition) => {
    return operationsApi.getUri({
      url: `/projects/${projectId}/purchase-orders/${poId}/documents/${documentId}`,
      params: { disposition },
    });
  };

  const getReportDocumentUrl = (reportId, documentId, disposition) => {
    return operationsApi.getUri({
      url: `/projects/${projectId}/qc-reports/${reportId}/documents/${documentId}`,
      params: { disposition },
    });
  };

  const handleReportCreated = async () => {
    setShowReportForm(false);
    await fetchProject();
  };

  if (showReportForm) {
    return (
      <AddQCReportModal
        project={project}
        onClose={() => setShowReportForm(false)}
        onSuccess={handleReportCreated}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-5xl max-h-[92vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-zinc-800">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <FolderKanban size={22} />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
                QC Project Workspace
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Project details, purchase orders and quality reports
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
              <Loader2 className="animate-spin mb-3" size={30} />
              <p className="text-sm">Loading project workspace...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle size={32} className="text-red-400 mb-3" />
              <p className="text-zinc-200 font-medium">
                Unable to load project
              </p>
              <p className="text-sm text-zinc-500 mt-1 max-w-md">{error}</p>

              <button
                onClick={fetchProject}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm"
              >
                <RefreshCw size={15} />
                Retry
              </button>
            </div>
          ) : project ? (
            <>
              {/* Project overview */}
              <section>
                <SectionHeading
                  icon={FolderKanban}
                  title="Project Overview"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
                  <Detail
                    label="Project Name"
                    value={project.projectName}
                  />
                  <Detail
                    label="Project Code"
                    value={project.projectCode}
                  />
                  <Detail
                    label="Project Status"
                    value={project.status}
                  />
                  <Detail
                    label="Client"
                    value={project.client?.clientName}
                  />
                  <Detail
                    label="Tender"
                    value={project.tender?.tenderTitle}
                  />
                  <Detail
                    label="Created On"
                    value={formatDate(project.createdAt)}
                  />
                </div>
              </section>

              {/* Purchase orders */}
              <section>
                <SectionHeading
                  icon={ShoppingCart}
                  title="Project Purchase Orders"
                  count={purchaseOrders.length}
                />

                {purchaseOrders.length === 0 ? (
                  <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center">
                    <Package
                      size={28}
                      className="mx-auto text-zinc-600 mb-3"
                    />
                    <p className="text-sm text-zinc-400">
                      No purchase orders have been created for this project.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {purchaseOrders.map((po) => (
                      <div
                        key={po._id}
                        className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-zinc-100">
                              {po.materialName}
                            </h4>
                            <p className="text-sm text-zinc-400 mt-1">
                              Vendor: {po.vendorName}
                            </p>
                          </div>

                          <span className="self-start text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {po.status?.replaceAll("_", " ") || "—"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                          <Detail
                            label="Quantity"
                            value={`${po.quantity ?? "—"} ${po.uom || ""}`}
                          />
                          <Detail
                            label="Unit Rate"
                            value={formatCurrency(po.unitRate)}
                          />
                          <Detail
                            label="Total Cost"
                            value={formatCurrency(po.totalCost)}
                          />
                          <Detail
                            label="Created On"
                            value={formatDate(po.createdAt)}
                          />
                        </div>

                        {po.documents?.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-zinc-800">
                            <p className="text-xs font-medium text-zinc-400 mb-3">
                              Supporting Documents
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {po.documents.map((doc) => (
                                <div
                                  key={doc._id}
                                  className="flex items-center gap-2 bg-zinc-800/70 border border-zinc-700 rounded-lg px-3 py-2 max-w-full"
                                >
                                  <FileText
                                    size={15}
                                    className="text-emerald-400 shrink-0"
                                  />
                                  <span className="text-xs text-zinc-300 truncate max-w-36">
                                    {doc.originalName || doc.name || "Document"}
                                  </span>

                                  <a
                                    href={getDocumentUrl(
                                      po._id,
                                      doc._id,
                                      "inline"
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="View document"
                                    className="text-zinc-400 hover:text-emerald-400"
                                  >
                                    <Eye size={15} />
                                  </a>

                                  <a
                                    href={getDocumentUrl(
                                      po._id,
                                      doc._id,
                                      "attachment"
                                    )}
                                    title="Download document"
                                    className="text-zinc-400 hover:text-emerald-400"
                                  >
                                    <Download size={15} />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* QC Reports */}
              <section>
                <SectionHeading
                  icon={ClipboardCheck}
                  title="QC Reports"
                  count={qcReports.length}
                  action={
                    <button
                      onClick={() => setShowReportForm(true)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold transition"
                    >
                      <Plus size={16} />
                      Add QC Report
                    </button>
                  }
                />

                {qcReports.length === 0 ? (
                  <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center">
                    <ClipboardCheck
                      size={28}
                      className="mx-auto text-zinc-600 mb-3"
                    />
                    <p className="text-zinc-300 font-medium">
                      No QC reports yet
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">
                      Create a report to record inspection results and
                      supporting documents for this project.
                    </p>
                    <button
                      onClick={() => setShowReportForm(true)}
                      className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
                    >
                      <Plus size={16} />
                      Create your first report
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {qcReports.map((report) => (
                      <div
                        key={report._id}
                        className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-zinc-100">
                              {report.title ||
                                report.reportTitle ||
                                report.description ||
                                "QC Report"}
                            </h4>
                            <p className="text-sm text-zinc-400 mt-1">
                              {report.description || "No description provided"}
                            </p>
                          </div>

                          <span className="text-xs text-zinc-500 flex items-center gap-1 shrink-0">
                            <CalendarDays size={13} />
                            {formatDate(report.createdAt)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          <Detail
                            label="Vendor"
                            value={
                              report.vendorName ||
                              report.purchaseOrder?.vendorName
                            }
                          />
                          <Detail
                            label="Purchase Order"
                            value={
                              report.purchaseOrder?.materialName ||
                              report.purchaseOrder?.poNumber ||
                              "—"
                            }
                          />
                        </div>

                        {report.customFields?.length > 0 && (
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {report.customFields.map((field, index) => (
                              <Detail
                                key={field._id || index}
                                label={field.name}
                                value={field.value}
                              />
                            ))}
                          </div>
                        )}

                        {report.documents?.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-zinc-800">
                            <p className="text-xs font-medium text-zinc-400 mb-3">
                              Supporting Documents
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {report.documents.map((doc) => (
                                <div
                                  key={doc._id}
                                  className="flex items-center gap-2 bg-zinc-800/70 border border-zinc-700 rounded-lg px-3 py-2"
                                >
                                  <FileText
                                    size={15}
                                    className="text-emerald-400"
                                  />
                                  <span className="text-xs text-zinc-300 truncate max-w-36">
                                    {doc.originalName || "Document"}
                                  </span>

                                  <a
                                    href={getReportDocumentUrl(
                                      report._id,
                                      doc._id,
                                      "inline"
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="View document"
                                    className="text-zinc-400 hover:text-emerald-400"
                                  >
                                    <Eye size={15} />
                                  </a>

                                  <a
                                    href={getReportDocumentUrl(
                                      report._id,
                                      doc._id,
                                      "attachment"
                                    )}
                                    title="Download document"
                                    className="text-zinc-400 hover:text-emerald-400"
                                  >
                                    <Download size={15} />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : null}
        </div>

        {/* Footer */}
        {!loading && !error && project && (
          <div className="p-4 border-t border-zinc-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm transition"
            >
              Close Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}