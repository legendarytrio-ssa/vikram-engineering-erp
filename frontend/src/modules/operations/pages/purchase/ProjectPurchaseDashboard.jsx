
import { useState } from "react";
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
} from "lucide-react";
import operationsApi from "../../api/operations_api";

export default function ProjectPurchaseDashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    materialName: "",
    vendorName: "",
    quantity: "",
    uom: "Nos",
    unitRate: "",
  });

  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      const response = await operationsApi.post(
        `/projects/${projectId}/purchase-orders`,
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/operations/purchase"), 2000);
      }
    } catch (error) {
      console.error("Failed to create PO:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500";

  const labelClass = "mb-2 block text-sm font-medium text-zinc-300";

  if (success) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
          <CheckCircle className="h-8 w-8 text-emerald-400" />
        </div>

        <h3 className="text-xl font-semibold text-zinc-100">
          Purchase Order Created
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
              onClick={() => navigate("/operations/purchase")}
              className="mb-4 flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-emerald-400"
            >
              <ArrowLeft size={16} />
              Back to Projects
            </button>

            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
              Create Purchase Order
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Add material purchase details and supporting documents.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
            <Package size={16} className="text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">
              New Purchase Order
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg">
          <div className="border-b border-zinc-800 px-6 py-5 sm:px-8">
            <h2 className="text-base font-semibold text-zinc-100">
              Purchase Information
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Enter the material and vendor information below.
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

            {/* Supporting Document */}
            <section>
              <div className="mb-5 flex items-center gap-2">
                <FileText size={17} className="text-emerald-400" />
                <h3 className="text-sm font-semibold text-zinc-200">
                  Supporting Document
                </h3>
                <span className="text-xs text-zinc-500">(Optional)</span>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/60 px-4 py-9 text-center transition-all hover:border-emerald-500/60 hover:bg-emerald-500/5">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                  <Upload size={21} className="text-emerald-400" />
                </div>

                <span className="text-sm font-medium text-zinc-200">
                  {file ? file.name : "Click to upload a document"}
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
            </section>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/operations/purchase")}
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
                    Submitting...
                  </>
                ) : (
                  "Submit Purchase Order"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
