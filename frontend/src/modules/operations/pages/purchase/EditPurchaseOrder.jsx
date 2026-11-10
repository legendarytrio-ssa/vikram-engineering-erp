
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Loader2,
  CheckCircle,
  Package,
  Building2,
  Hash,
  IndianRupee,
  FileText,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import operationsApi from "../../api/operations_Api.js";

export default function EditPurchaseOrder() {
  const { projectId, poId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    materialName: "",
    vendorName: "",
    quantity: "",
    uom: "Nos",
    unitRate: "",
  });

  const [existingDocuments, setExistingDocuments] = useState([]);
  const [file, setFile] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing Purchase Order
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await operationsApi.get(
          `/projects/${projectId}/purchase-orders/${poId}`
        );

        if (!response.data.success) {
          throw new Error("Unable to fetch Purchase Order.");
        }

        const po = response.data.data;

        setFormData({
          materialName: po.materialName || "",
          vendorName: po.vendorName || "",
          quantity: po.quantity ?? "",
          uom: po.uom || "Nos",
          unitRate: po.unitRate ?? "",
        });

        setExistingDocuments(po.documents || []);
      } catch (err) {
        console.error("Failed to fetch Purchase Order:", err);

        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load Purchase Order."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId && poId) {
      fetchPurchaseOrder();
    }
  }, [projectId, poId]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");

    const submitData = new FormData();

    submitData.append("materialName", formData.materialName);
    submitData.append("vendorName", formData.vendorName);
    submitData.append("quantity", formData.quantity);
    submitData.append("uom", formData.uom);
    submitData.append("unitRate", formData.unitRate);

    if (file) {
      submitData.append("documents", file);
    }

    try {
      const response = await operationsApi.put(
        `/projects/${projectId}/purchase-orders/${poId}`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);

        setTimeout(() => {
          navigate("/operations/purchase");
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to update PO:", err);

      setError(
        err.response?.data?.message ||
        "Failed to update Purchase Order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500";

  const labelClass =
    "mb-2 block text-sm font-medium text-zinc-300";

  const backToPurchase = () => navigate("/operations/purchase");

  const getDocumentUrl = (documentId, disposition) => {
    return operationsApi.getUri({
      url: `/projects/${projectId}/purchase-orders/${poId}/documents/${documentId}`,
      params: { disposition },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="mr-3 animate-spin text-emerald-400" size={22} />
        Loading Purchase Order...
      </div>
    );
  }

  if (error && !formData.materialName) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4 text-zinc-100">
        <AlertCircle size={35} className="text-red-400" />

        <p className="text-sm text-red-400">{error}</p>

        <button
          onClick={backToPurchase}
          className="rounded-lg border border-zinc-700 px-5 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          Back to Purchase Hub
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-zinc-950 text-zinc-100">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
          <CheckCircle className="h-8 w-8 text-emerald-400" />
        </div>

        <h3 className="text-xl font-semibold">
          Purchase Order Updated
        </h3>

        <p className="text-sm text-zinc-400">
          Redirecting to Purchase Hub...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 px-4 py-8 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6 pb-10">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={backToPurchase}
              className="mb-4 flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-emerald-400"
            >
              <ArrowLeft size={16} />
              Back to Projects
            </button>

            <h1 className="text-2xl font-semibold tracking-tight">
              Edit Purchase Order
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Update material purchase details and supporting documents.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
            <Package size={16} className="text-emerald-400" />

            <span className="text-xs font-medium text-emerald-400">
              Edit Purchase Order
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg">

          <div className="border-b border-zinc-800 px-6 py-5 sm:px-8">
            <h2 className="text-base font-semibold">
              Purchase Information
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Modify the existing Purchase Order details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-8">

            {/* Material Details */}
            <section>
              <div className="mb-5 flex items-center gap-2">
                <Package size={17} className="text-emerald-400" />

                <h3 className="text-sm font-semibold text-zinc-200">
                  Material Details
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className={labelClass}>Material Name</label>

                  <div className="relative">
                    <Package
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                    />

                    <input
                      required
                      type="text"
                      name="materialName"
                      value={formData.materialName}
                      onChange={handleInputChange}
                      placeholder="Enter material name"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Vendor Name</label>

                  <div className="relative">
                    <Building2
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                    />

                    <input
                      required
                      type="text"
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      placeholder="Enter vendor name"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

              </div>
            </section>

            <div className="border-t border-zinc-800" />

            {/* Quantity and Pricing */}
            <section>
              <div className="mb-5 flex items-center gap-2">
                <Hash size={17} className="text-emerald-400" />

                <h3 className="text-sm font-semibold text-zinc-200">
                  Quantity & Pricing
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className={labelClass}>Quantity</label>

                  <input
                    required
                    type="number"
                    min="0"
                    step="any"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Unit of Measure (UOM)
                  </label>

                  <select
                    name="uom"
                    value={formData.uom}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="Nos">Nos</option>
                    <option value="Tons">Tons</option>
                    <option value="Kgs">Kgs</option>
                    <option value="Liters">Liters</option>
                    <option value="Meters">Meters</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Unit Rate (₹)</label>

                  <div className="relative">
                    <IndianRupee
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                    />

                    <input
                      required
                      type="number"
                      min="0"
                      step="any"
                      name="unitRate"
                      value={formData.unitRate}
                      onChange={handleInputChange}
                      placeholder="Enter rate per unit"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

              </div>
            </section>

            <div className="border-t border-zinc-800" />

            {/* Existing Documents */}
            <section>
              <div className="mb-5 flex items-center gap-2">
                <FileText size={17} className="text-emerald-400" />

                <h3 className="text-sm font-semibold text-zinc-200">
                  Existing Documents
                </h3>
              </div>

              {existingDocuments.length > 0 ? (
                <div className="space-y-3">
                  {existingDocuments.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText
                          size={20}
                          className="shrink-0 text-emerald-400"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-200">
                            {doc.originalName}
                          </p>

                          <p className="text-xs text-zinc-500">
                            {doc.mimeType} · {(doc.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <a
                          href={getDocumentUrl(doc._id, "inline")}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
                        >
                          View <ExternalLink size={13} />
                        </a>

                        <a
                          href={getDocumentUrl(doc._id, "attachment")}
                          className="text-xs text-zinc-400 hover:text-zinc-200"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-zinc-800 p-5 text-center text-sm text-zinc-500">
                  No documents uploaded for this Purchase Order.
                </p>
              )}
            </section>

            <div className="border-t border-zinc-800" />

            {/* Add New Document */}
            <section>
              <div className="mb-5 flex items-center gap-2">
                <Upload size={17} className="text-emerald-400" />

                <h3 className="text-sm font-semibold text-zinc-200">
                  Add Supporting Document
                </h3>

                <span className="text-xs text-zinc-500">(Optional)</span>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/60 px-4 py-9 text-center transition-all hover:border-emerald-500/60 hover:bg-emerald-500/5">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                  <Upload size={21} className="text-emerald-400" />
                </div>

                <span className="text-sm font-medium text-zinc-200">
                  {file ? file.name : "Click to upload a new document"}
                </span>

                <span className="mt-2 text-xs text-zinc-500">
                  PDF, JPG or PNG · Maximum size 20MB
                </span>

                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>

              <p className="mt-2 text-xs text-zinc-500">
                Existing documents will be retained. The new document will be added alongside them.
              </p>
            </section>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={backToPurchase}
                className="rounded-lg border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
