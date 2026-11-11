
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
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileWarning,
  CalendarDays,
  Files,
} from "lucide-react";

import {
  fetchProjectDetails,
  deletePurchaseOrder,
  deletePurchaseOrderDocument,
  getPurchaseOrderDocumentUrl,
  getSalesDocumentUrl,
} from "../services/operationServices.js";

// --------------------------------------------------
// Detail Component
// --------------------------------------------------

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

// --------------------------------------------------
// Section Component
// --------------------------------------------------

function Section({ title, icon: Icon, children }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2">
          <Icon size={17} className="text-emerald-400" />
        </div>

        <h3 className="font-semibold text-white">{title}</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

// --------------------------------------------------
// Document List Component
// --------------------------------------------------

function DocumentList({
  title,
  documents = [],
  onView,
  onDownload,
  openingDocumentId,
}) {
  const hasActions = Boolean(onView || onDownload);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Files size={16} className="text-zinc-500" />

          <h4 className="text-sm font-semibold text-zinc-200">
            {title}
          </h4>
        </div>

        <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-400">
          {documents.length} files
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-5 text-center">
          <FileText size={22} className="mx-auto mb-2 text-zinc-600" />

          <p className="text-sm text-zinc-500">
            No documents uploaded.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          {documents.map((doc, index) => {
            const isOpening = openingDocumentId === doc._id;

            return (
              <div
                key={doc._id || doc.key || index}
                className={`flex flex-col gap-3 bg-zinc-900/60 p-3 sm:flex-row sm:items-center sm:justify-between ${
                  index !== documents.length - 1
                    ? "border-b border-zinc-800"
                    : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="shrink-0 rounded-lg border border-blue-500/20 bg-blue-500/10 p-2.5">
                    <FileText size={18} className="text-blue-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="break-all text-sm font-medium text-zinc-200">
                      {doc.originalName || "Untitled document"}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {doc.mimeType || "Unknown type"}
                      {" · "}
                      {formatFileSize(doc.size)}
                    </p>
                  </div>
                </div>

                {hasActions && (
                  <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                    {onView && (
                      <button
                        type="button"
                        onClick={() => onView(doc)}
                        disabled={isOpening}
                        className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-emerald-400 transition hover:border-emerald-500/40 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isOpening ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Eye size={14} />
                        )}
                        View
                      </button>
                    )}

                    {onDownload && (
                      <button
                        type="button"
                        onClick={() => onDownload(doc)}
                        disabled={isOpening}
                        className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-blue-400 transition hover:border-blue-500/40 hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isOpening ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}
                        Download
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// --------------------------------------------------
// Utility Functions
// --------------------------------------------------

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatFileSize(bytes) {
  if (!bytes) return "Size unavailable";

  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(1)} KB`;
}

// --------------------------------------------------
// Toast Notification Component
// --------------------------------------------------

function Toast({ notification, onClose }) {
  if (!notification) return null;

  const styles = {
    success: {
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      border: "border-emerald-500/30",
      title: "Success",
    },
    error: {
      icon: XCircle,
      iconColor: "text-red-400",
      border: "border-red-500/30",
      title: "Something went wrong",
    },
  };

  const config = styles[notification.type] || styles.success;
  const Icon = config.icon;

  return (
    <div className="fixed right-5 top-5 z-[100] w-[calc(100%-40px)] max-w-sm animate-[toastIn_0.3s_ease-out]">
      <div
        className={`flex items-start gap-3 rounded-xl border ${config.border} bg-zinc-900 p-4 shadow-2xl shadow-black/40`}
      >
        <div className={`mt-0.5 shrink-0 ${config.iconColor}`}>
          <Icon size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">
            {config.title}
          </p>

          <p className="mt-1 break-words text-sm leading-relaxed text-zinc-400">
            {notification.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md p-1 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
          aria-label="Close notification"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
}

// --------------------------------------------------
// Delete Confirmation Modal
// --------------------------------------------------

function DeleteConfirmationModal({
  confirmation,
  onCancel,
  onConfirm,
  deleting,
}) {
  if (!confirmation) return null;

  const isPO = confirmation.type === "purchaseOrder";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={deleting ? undefined : onCancel}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50 animate-[modalIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5">
              <AlertTriangle size={22} className="text-red-400" />
            </div>

            <div>
              <h3 className="font-semibold text-white">
                {isPO ? "Delete Purchase Order" : "Delete Document"}
              </h3>

              <p className="mt-0.5 text-xs text-zinc-500">
                This action requires your confirmation
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <p className="text-sm leading-relaxed text-zinc-300">
            {isPO
              ? "Are you sure you want to permanently delete this Purchase Order?"
              : "Are you sure you want to permanently delete this document?"}
          </p>

          <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3">
            {isPO ? (
              <Package size={18} className="mt-0.5 shrink-0 text-red-400" />
            ) : (
              <FileWarning size={18} className="mt-0.5 shrink-0 text-red-400" />
            )}

            <div className="min-w-0">
              <p className="break-all text-sm font-medium text-zinc-200">
                {confirmation.name}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-red-300/80">
                {isPO
                  ? "The Purchase Order and all its associated documents in Tigris will be deleted."
                  : "The selected file will be deleted from Tigris and its reference will be removed from MongoDB."}
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-500">
            This operation cannot be undone.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-zinc-800 bg-zinc-900/50 p-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------
// Main Project Details Modal
// --------------------------------------------------

export default function ProjectDetailsModal({ projectId, onClose }) {
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPurchaseOrders, setShowPurchaseOrders] = useState(false);

  const [deletingPOId, setDeletingPOId] = useState(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState(null);

  const [openingSalesDocumentId, setOpeningSalesDocumentId] = useState(null);

  const [confirmation, setConfirmation] = useState(null);
  const [notification, setNotification] = useState(null);

  // --------------------------------------------------
  // Fetch Project Details
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Auto-dismiss Toast Notifications
  // --------------------------------------------------

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [notification]);

  if (!projectId) return null;

  const purchaseOrders = project?.purchaseItems || [];

  const showToast = (type, message) => {
    setNotification({
      id: Date.now(),
      type,
      message,
    });
  };

  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------

  const handleCreatePO = () => {
    onClose();

    navigate(
      `/operations/purchase/projects/${projectId}/purchase-orders/new`
    );
  };

  const handleEditPO = (poId) => {
    onClose();

    navigate(
      `/operations/purchase/projects/${projectId}/purchase-orders/${poId}/edit`
    );
  };

  // --------------------------------------------------
  // Sales Document View / Download
  // --------------------------------------------------

  const handleSalesDocumentAction = async (doc, disposition) => {
    if (!doc?._id) {
      showToast("error", "Sales document ID is missing.");
      return;
    }

    let newWindow = null;

    try {
      setOpeningSalesDocumentId(doc._id);

      // Open a blank tab synchronously to avoid popup blocking.
      if (disposition === "inline") {
        newWindow = window.open("about:blank", "_blank");

        if (!newWindow) {
          showToast(
            "error",
            "Your browser blocked the new tab. Please allow pop-ups and try again."
          );
          return;
        }
      }

      const url = await getSalesDocumentUrl(
        projectId,
        doc._id,
        disposition
      );

      if (!url) {
        throw new Error("Could not generate the document URL.");
      }

      if (disposition === "inline") {
        newWindow.location.href = url;
      } else {
        // The backend sets Content-Disposition to attachment.
        // This triggers the browser download using the original filename.
        const link = document.createElement("a");
        link.href = url;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.error("Sales document action failed:", err);

      if (newWindow && !newWindow.closed) {
        newWindow.close();
      }

      showToast(
        "error",
        err.response?.data?.message ||
          err.message ||
          "Unable to open the sales document."
      );
    } finally {
      setOpeningSalesDocumentId(null);
    }
  };

  const handleViewSalesDocument = (doc) => {
    handleSalesDocumentAction(doc, "inline");
  };

  const handleDownloadSalesDocument = (doc) => {
    handleSalesDocumentAction(doc, "attachment");
  };

  // --------------------------------------------------
  // Purchase Order Document URLs
  // --------------------------------------------------

  const getDocumentUrl = (poId, documentId, disposition) => {
    return getPurchaseOrderDocumentUrl(
      projectId,
      poId,
      documentId,
      disposition
    );
  };

  // --------------------------------------------------
  // Delete Actions
  // --------------------------------------------------

  const requestDeletePO = (po) => {
    setConfirmation({
      type: "purchaseOrder",
      id: po._id,
      name: po.materialName || "Purchase Order",
    });
  };

  const requestDeleteDocument = (poId, doc) => {
    setConfirmation({
      type: "document",
      poId,
      id: doc._id,
      name: doc.originalName || "Untitled document",
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmation) return;

    const currentConfirmation = confirmation;

    try {
      setNotification(null);

      if (currentConfirmation.type === "purchaseOrder") {
        setDeletingPOId(currentConfirmation.id);

        await deletePurchaseOrder(
          projectId,
          currentConfirmation.id
        );

        setProject((prev) => ({
          ...prev,
          purchaseItems: (prev.purchaseItems || []).filter(
            (po) => po._id !== currentConfirmation.id
          ),
        }));

        setConfirmation(null);

        showToast(
          "success",
          "Purchase Order and its associated documents have been deleted successfully."
        );
      } else {
        const deletingKey =
          `${currentConfirmation.poId}:${currentConfirmation.id}`;

        setDeletingDocumentId(deletingKey);

        const response = await deletePurchaseOrderDocument(
          projectId,
          currentConfirmation.poId,
          currentConfirmation.id
        );

        const updatedPO = response.data;

        setProject((prev) => ({
          ...prev,
          purchaseItems: (prev.purchaseItems || []).map((po) =>
            po._id === currentConfirmation.poId ? updatedPO : po
          ),
        }));

        setConfirmation(null);

        showToast(
          "success",
          "Document has been deleted successfully."
        );
      }
    } catch (err) {
      console.error("Deletion failed:", err);

      setConfirmation(null);

      showToast(
        "error",
        err.response?.data?.message ||
          err.message ||
          "The deletion could not be completed. Please try again."
      );
    } finally {
      setDeletingPOId(null);
      setDeletingDocumentId(null);
    }
  };

  const isDeleting =
    deletingPOId !== null || deletingDocumentId !== null;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <>
      <Toast
        notification={notification}
        onClose={() => setNotification(null)}
      />

      <DeleteConfirmationModal
        confirmation={confirmation}
        onCancel={() => {
          if (!isDeleting) setConfirmation(null);
        }}
        onConfirm={handleConfirmDelete}
        deleting={isDeleting}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
        onClick={onClose}
      >
        <div
          className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
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
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              aria-label="Close project overview"
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
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 py-12 text-center text-sm text-red-400">
                {error}
              </div>
            ) : project ? (
              <div className="space-y-8">

                {/* Project Heading */}
                <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-zinc-900/40 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-emerald-400">
                        {project.projectCode || "Project"}
                      </p>

                      <h3 className="text-xl font-bold text-white">
                        {project.projectName}
                      </h3>
                    </div>

                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                      {project.status || "UNKNOWN"}
                    </span>
                  </div>
                </div>

                {/* Basic Project Information */}
                <Section
                  title="Basic Project Information"
                  icon={FolderKanban}
                >
                  <Detail
                    label="Project Name"
                    value={project.projectName}
                  />

                  <Detail
                    label="Project Code"
                    value={project.projectCode}
                  />

                  <Detail
                    label="Project ID"
                    value={project._id}
                  />

                  <Detail
                    label="Status"
                    value={project.status}
                  />

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
                </Section>

                <div className="border-t border-zinc-800" />

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

                <div className="border-t border-zinc-800" />

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

                <div className="border-t border-zinc-800" />

                {/* Sales Information */}
                <Section title="Sales Information" icon={ClipboardList}>
                  <Detail
                    label="PO Description"
                    value={project.salesData?.poDescription}
                  />
                </Section>

                {/* Sales Documents with View and Download */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4 sm:p-5">
                  <DocumentList
                    title="Sales Documents"
                    documents={project.salesData?.documents || []}
                    onView={handleViewSalesDocument}
                    onDownload={handleDownloadSalesDocument}
                    openingDocumentId={openingSalesDocumentId}
                  />
                </div>

                <div className="border-t border-zinc-800" />

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

                {/* Purchase Orders */}
                <div className="border-t border-zinc-800" />

                <section className="space-y-4">
                  <button
                    type="button"
                    onClick={() =>
                      setShowPurchaseOrders((prev) => !prev)
                    }
                    className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 transition hover:border-emerald-500/30 hover:bg-zinc-900"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2">
                        <Package size={19} className="text-emerald-400" />
                      </div>

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
                      className={`text-zinc-400 transition-transform duration-200 ${
                        showPurchaseOrders ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showPurchaseOrders && (
                    <div className="space-y-4">
                      {purchaseOrders.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 py-8 text-center">
                          <Package
                            size={24}
                            className="mx-auto mb-2 text-zinc-600"
                          />

                          <p className="text-sm text-zinc-500">
                            No purchase orders found for this project.
                          </p>
                        </div>
                      ) : (
                        purchaseOrders.map((po, index) => (
                          <div
                            key={po._id}
                            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50"
                          >
                            {/* PO Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/70 p-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Package
                                    size={16}
                                    className="text-emerald-400"
                                  />

                                  <h4 className="font-semibold text-white">
                                    Purchase Order #{index + 1}
                                  </h4>
                                </div>

                                <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                                  <CalendarDays size={12} />

                                  {po.createdAt
                                    ? new Date(
                                        po.createdAt
                                      ).toLocaleDateString()
                                    : "Date unavailable"}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                  {po.status?.replaceAll("_", " ") || "UNKNOWN"}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleEditPO(po._id)}
                                  className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
                                >
                                  <Pencil size={13} />
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => requestDeletePO(po)}
                                  disabled={isDeleting}
                                  className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <Trash2 size={13} />
                                  Delete
                                </button>
                              </div>
                            </div>

                            {/* PO Details */}
                            <div className="grid grid-cols-1 gap-4 p-4 text-sm sm:grid-cols-2">
                              <div>
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                  Material
                                </p>

                                <p className="text-zinc-200">
                                  {po.materialName || "N/A"}
                                </p>
                              </div>

                              <div>
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                  Vendor
                                </p>

                                <p className="text-zinc-200">
                                  {po.vendorName || "N/A"}
                                </p>
                              </div>

                              <div>
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                  Quantity
                                </p>

                                <p className="text-zinc-200">
                                  {po.quantity ?? "N/A"} {po.uom || ""}
                                </p>
                              </div>

                              <div>
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                  Unit Rate
                                </p>

                                <p className="text-zinc-200">
                                  {formatCurrency(po.unitRate)}
                                </p>
                              </div>

                              <div className="sm:col-span-2">
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                  Total Cost
                                </p>

                                <p className="text-base font-semibold text-emerald-400">
                                  {formatCurrency(po.totalCost)}
                                </p>
                              </div>
                            </div>

                            {/* Supporting Documents */}
                            <div className="border-t border-zinc-800 p-4">
                              <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Files
                                    size={15}
                                    className="text-zinc-500"
                                  />

                                  <p className="text-sm font-medium text-zinc-300">
                                    Supporting Documents
                                  </p>
                                </div>

                                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                                  {po.documents?.length || 0}
                                </span>
                              </div>

                              {!po.documents?.length ? (
                                <p className="rounded-lg border border-dashed border-zinc-800 p-4 text-center text-xs text-zinc-500">
                                  No documents attached.
                                </p>
                              ) : (
                                <div className="overflow-hidden rounded-lg border border-zinc-800">
                                  {po.documents.map((doc, docIndex) => {
                                    const isDeletingDocument =
                                      deletingDocumentId ===
                                      `${po._id}:${doc._id}`;

                                    return (
                                      <div
                                        key={doc._id}
                                        className={`flex flex-col gap-3 bg-zinc-950/70 p-3 sm:flex-row sm:items-center sm:justify-between ${
                                          docIndex !== po.documents.length - 1
                                            ? "border-b border-zinc-800"
                                            : ""
                                        }`}
                                      >
                                        <div className="flex min-w-0 items-center gap-3">
                                          <div className="rounded-lg bg-blue-500/10 p-2">
                                            <FileText
                                              size={17}
                                              className="text-blue-400"
                                            />
                                          </div>

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
                                        </div>

                                        <div className="flex shrink-0 flex-wrap items-center gap-3">
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
                                            <Eye size={15} />
                                            View
                                          </a>

                                          <a
                                            href={getDocumentUrl(
                                              po._id,
                                              doc._id,
                                              "attachment"
                                            )}
                                            className="flex items-center gap-1.5 text-sm text-blue-400 transition hover:text-blue-300"
                                          >
                                            <Download size={15} />
                                            Download
                                          </a>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              requestDeleteDocument(po._id, doc)
                                            }
                                            disabled={isDeleting}
                                            className="flex items-center gap-1.5 text-sm text-red-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                                          >
                                            {isDeletingDocument ? (
                                              <Loader2
                                                size={15}
                                                className="animate-spin"
                                              />
                                            ) : (
                                              <Trash2 size={15} />
                                            )}

                                            {isDeletingDocument
                                              ? "Deleting..."
                                              : "Delete"}
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </section>

                <div className="border-t border-zinc-800" />

                {/* Finance Information */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2">
                      <Wallet size={17} className="text-emerald-400" />
                    </div>

                    <h3 className="font-semibold text-white">
                      Finance Information
                    </h3>
                  </div>

                  <DocumentList
                    title="Finance Documents"
                    documents={project.financeData?.documents || []}
                  />
                </section>

                {/* Additional Information */}
                {project.others &&
                  Object.keys(project.others).length > 0 && (
                    <>
                      <div className="border-t border-zinc-800" />

                      <Section
                        title="Additional Information"
                        icon={Hash}
                      >
                        {Object.entries(project.others).map(([key, value]) => (
                          <Detail key={key} label={key} value={value} />
                        ))}
                      </Section>
                    </>
                  )}

                {/* Create Purchase Order */}
                <div className="border-t border-zinc-800" />

                <section className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-zinc-900/40 p-5">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5">
                        <ShoppingCart
                          className="text-emerald-400"
                          size={22}
                        />
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
                      type="button"
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
          <div className="flex justify-end border-t border-zinc-800 bg-zinc-950 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Component Animations */}
      <style>{`
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
