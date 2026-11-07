
import { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  ClipboardCheck,
  ArrowLeft,
} from "lucide-react";

import operationsApi from "../api/operations_api";

const inputClass =
  "w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-emerald-500 transition";

const labelClass = "block text-sm font-medium text-zinc-300 mb-2";

export default function AddQCReportModal({
  project,
  onClose,
  onSuccess,
}) {
  const [vendorName, setVendorName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [customFields, setCustomFields] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Add a new custom parameter.
  const addField = () => {
    setCustomFields((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        value: "",
      },
    ]);
  };

  // Update a custom parameter.
  const updateField = (id, key, value) => {
    setCustomFields((prev) =>
      prev.map((field) =>
        field.id === id
          ? { ...field, [key]: value }
          : field
      )
    );
  };

  // Remove a custom parameter.
  const removeField = (id) => {
    setCustomFields((prev) =>
      prev.filter((field) => field.id !== id)
    );
  };

  // Handle supporting document selection.
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    setDocuments((prev) => {
      const combined = [...prev, ...selectedFiles];

      // Prevent duplicate file selections.
      return combined.filter(
        (file, index, array) =>
          array.findIndex(
            (other) =>
              other.name === file.name &&
              other.size === file.size &&
              other.lastModified === file.lastModified
          ) === index
      );
    });

    // Allow selecting the same file again after removal.
    e.target.value = "";
  };

  // Remove a selected document.
  const removeDocument = (indexToRemove) => {
    setDocuments((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // Submit QC report.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Report title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Report description is required.");
      return;
    }

    // Prepare custom parameters.
    const cleanedFields = customFields
      .map(({ name, value }) => ({
        name: name.trim(),
        value: value.trim(),
      }))
      .filter((field) => field.name || field.value);

    // Both name and value must be provided.
    const incompleteField = cleanedFields.some(
      (field) => !field.name || !field.value
    );

    if (incompleteField) {
      setError(
        "Please provide both a field name and value for every custom parameter, or remove the incomplete field."
      );
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("vendorName", vendorName.trim());

      formData.append(
        "customFields",
        JSON.stringify(cleanedFields)
      );

      documents.forEach((file) => {
        formData.append("documents", file);
      });

      const response = await operationsApi.post(
        `/projects/${project._id}/qc-reports`,
        formData
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to create QC report."
        );
      }

      await onSuccess();
    } catch (err) {
      console.error("QC report creation error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Something went wrong while creating the report."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-3xl max-h-[94vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 p-5 border-b border-zinc-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ClipboardCheck size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-zinc-100">
                Add QC Report
              </h2>

              <p className="text-xs text-zinc-500 mt-1">
                Record quality information for this project
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-5 sm:p-6 space-y-7">

            {/* Project Information */}
            <section>
              <h3 className="text-sm font-semibold text-zinc-100 mb-4">
                Project Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className={labelClass}>
                    Project Name
                  </label>

                  <input
                    value={project?.projectName || ""}
                    readOnly
                    className={`${inputClass} opacity-70 cursor-not-allowed`}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Project ID
                  </label>

                  <input
                    value={
                      project?.projectCode ||
                      project?._id ||
                      ""
                    }
                    readOnly
                    className={`${inputClass} opacity-70 cursor-not-allowed`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Vendor Name
                    <span className="text-zinc-500 font-normal ml-2">
                      (Optional)
                    </span>
                  </label>

                  <input
                    value={vendorName}
                    onChange={(e) =>
                      setVendorName(e.target.value)
                    }
                    placeholder="Enter vendor name"
                    className={inputClass}
                    maxLength={150}
                  />

                  <p className="text-xs text-zinc-600 mt-1.5">
                    Enter the vendor associated with this report, if applicable.
                  </p>
                </div>

              </div>
            </section>

            <div className="border-t border-zinc-800" />

            {/* Report Details */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-100">
                Report Details
              </h3>

              <div>
                <label className={labelClass}>
                  Report Title
                  <span className="text-red-400 ml-1">*</span>
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Raw Material Inspection Report"
                  className={inputClass}
                  maxLength={150}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Description
                  <span className="text-red-400 ml-1">*</span>
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe the inspection, test, observation or quality findings..."
                  className={`${inputClass} min-h-28 resize-y`}
                  rows={4}
                  maxLength={3000}
                  required
                />

                <p className="text-xs text-zinc-600 text-right mt-1">
                  {description.length}/3000
                </p>
              </div>
            </section>

            <div className="border-t border-zinc-800" />

            {/* Custom Parameters */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">
                    Custom Parameters
                  </h3>

                  <p className="text-xs text-zinc-500 mt-1">
                    Add additional quality measurements or observations.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addField}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-sm transition"
                >
                  <Plus size={16} />
                  Add Field
                </button>
              </div>

              {customFields.length === 0 ? (
                <div className="border border-dashed border-zinc-800 rounded-xl p-6 text-center">
                  <p className="text-sm text-zinc-500">
                    No custom parameters added.
                  </p>

                  <p className="text-xs text-zinc-600 mt-1">
                    Use Add Field to define your own parameter names and values.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-zinc-400">
                          PARAMETER {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeField(field.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                          title="Remove field"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>
                            Field Name
                          </label>

                          <input
                            value={field.name}
                            onChange={(e) =>
                              updateField(
                                field.id,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="e.g. Tensile Strength"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>
                            Value
                          </label>

                          <input
                            value={field.value}
                            onChange={(e) =>
                              updateField(
                                field.id,
                                "value",
                                e.target.value
                              )
                            }
                            placeholder="e.g. 450 MPa"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="border-t border-zinc-800" />

            {/* Supporting Documents */}
            <section>
              <h3 className="text-sm font-semibold text-zinc-100 mb-2">
                Supporting Documents
              </h3>

              <p className="text-xs text-zinc-500 mb-4">
                Attach test certificates, inspection sheets, images or other relevant files.
              </p>

              <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-zinc-700 hover:border-emerald-500/60 rounded-xl p-7 cursor-pointer transition bg-zinc-900/30">
                <Upload
                  size={23}
                  className="text-emerald-400"
                />

                <span className="text-sm text-zinc-300">
                  Click to upload supporting documents
                </span>

                <span className="text-xs text-zinc-600">
                  Multiple files supported
                </span>

                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  {documents.map((file, index) => (
                    <div
                      key={`${file.name}-${file.lastModified}-${index}`}
                      className="flex items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText
                          size={16}
                          className="text-emerald-400 shrink-0"
                        />

                        <div className="min-w-0">
                          <p className="text-sm text-zinc-300 truncate">
                            {file.name}
                          </p>

                          <p className="text-xs text-zinc-600">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 shrink-0"
                        title="Remove document"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle
                  size={17}
                  className="shrink-0 mt-0.5"
                />
                <p>{error}</p>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-zinc-950 border-t border-zinc-800 p-4 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm disabled:opacity-50"
            >
              <ArrowLeft size={16} />
              Back to Workspace
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {submitting ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Creating Report...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create QC Report
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
