// import { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// import {
//   ArrowLeft,
//   Building2,
//   Check,
//   CirclePlus,
//   Trash2,
//   Users,
// } from "lucide-react";

// import salesApi from "../services/salesApi";

// export default function AllClientsForm() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [companyName, setCompanyName] = useState(
//     location.state?.companyName || ""
//   );

//   const [ceos, setCeos] = useState([""]);
//   const [contactEmail, setContactEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [notes, setNotes] = useState("");

//   const [error, setError] = useState("");
//   const [saved, setSaved] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [existing, setExisting] = useState([]);

//   // Fetch existing clients
//   useEffect(() => {
//     salesApi
//       .get("/clients/getClients")
//       .then((res) => setExisting(res.data))
//       .catch((err) =>
//         console.error("Failed to load existing clients", err)
//       );
//   }, []);

//   // Redirect to Add Tender after saving
//   useEffect(() => {
//     if (!saved) return;

//     const timer = setTimeout(() => {
//       navigate("/sales/tenders/new");
//     }, 900);

//     return () => clearTimeout(timer);
//   }, [saved, navigate]);

//   function updateCeo(index, value) {
//     setCeos((current) =>
//       current.map((ceo, i) => (i === index ? value : ceo))
//     );
//   }

//   async function saveClient(event) {
//     event.preventDefault();
//     setError("");

//     const company = companyName.trim();

//     const cleanCeos = [
//       ...new Set(
//         ceos.map((name) => name.trim()).filter(Boolean)
//       ),
//     ];

//     if (!company || cleanCeos.length === 0) {
//       setError("Company name and at least one CEO are required.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await salesApi.post("/clients/createClients", {
//         companyName: company,
//         ceos: cleanCeos,
//         contactEmail: contactEmail.trim(),
//         phone: phone.trim(),
//         address: address.trim(),
//         notes: notes.trim(),
//       });

//       setSaved(true);
//     } catch (err) {
//       setError(
//         err.response?.data?.error || "Failed to connect to server."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   const duplicate =
//     companyName.trim() &&
//     existing.some(
//       (c) =>
//         c.companyName.toLowerCase() ===
//         companyName.trim().toLowerCase()
//     );

//   return (
//     <main className="min-h-screen bg-zinc-950 text-zinc-100">
//       <div className="mx-auto max-w-4xl px-5 py-7 sm:px-8 lg:px-10">
//         {/* Header */}
//         <header className="flex flex-col gap-5 border-b border-zinc-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
//           <Link to="/" className="flex items-center gap-3">
//             <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
//               <Building2 size={19} />
//             </span>

//             <span>
//               <span className="block text-sm font-semibold tracking-tight text-zinc-100">
//                 Vikram Engineering
//               </span>

//               <span className="mt-0.5 block text-[11px] tracking-[0.13em] text-zinc-400">
//                 ERP WORKSPACE
//               </span>
//             </span>
//           </Link>

//           <span className="w-fit rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300">
//             CLIENT DIRECTORY
//           </span>
//         </header>

//         {/* Back navigation */}
//         <button
//           onClick={() => navigate("/sales/tenders/new")}
//           className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
//         >
//           <ArrowLeft size={16} />
//           Back to Add Tender
//         </button>

//         {/* Page introduction */}
//         <section className="mb-8 mt-7">
//           <p className="text-xs font-semibold tracking-[0.15em] text-emerald-500">
//             CLIENT RECORD
//           </p>

//           <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
//             Add client
//           </h1>

//           <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
//             Register the company and its CEO names here. Those records
//             will be available in the tender form&apos;s real-time
//             company search.
//           </p>
//         </section>

//         {/* Client form */}
//         <form onSubmit={saveClient} className="space-y-5">
//           <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-7">
//             <div className="mb-6 flex items-start gap-3 border-b border-zinc-800 pb-5">
//               <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
//                 <Users size={18} />
//               </span>

//               <div>
//                 <h2 className="font-semibold text-zinc-100">
//                   Company information
//                 </h2>

//                 <p className="mt-1 text-sm text-zinc-400">
//                   Company name and CEO are required.
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-5 md:grid-cols-2">
//               {/* Company name */}
//               <div className="md:col-span-2">
//                 <label
//                   htmlFor="companyName"
//                   className="mb-2 block text-sm font-medium text-zinc-300"
//                 >
//                   Company name{" "}
//                   <span className="text-rose-500">*</span>
//                 </label>

//                 <input
//                   id="companyName"
//                   required
//                   value={companyName}
//                   onChange={(e) =>
//                     setCompanyName(e.target.value)
//                   }
//                   placeholder="Enter registered company name"
//                   className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
//                 />

//                 {duplicate && (
//                   <p className="mt-2 text-xs text-amber-500">
//                     This company already exists. Saving will add CEO
//                     names to its existing record.
//                   </p>
//                 )}
//               </div>

//               {/* CEO fields */}
//               <div className="md:col-span-2">
//                 <div className="mb-2 flex items-center justify-between gap-3">
//                   <label className="block text-sm font-medium text-zinc-300">
//                     Company CEO{" "}
//                     <span className="text-rose-500">*</span>
//                   </label>

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setCeos((current) => [...current, ""])
//                     }
//                     className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 transition hover:text-emerald-300 hover:underline"
//                   >
//                     <CirclePlus size={14} />
//                     Add another CEO
//                   </button>
//                 </div>

//                 <div className="space-y-3">
//                   {ceos.map((ceo, index) => (
//                     <div key={index} className="flex gap-2">
//                       <input
//                         required={index === 0}
//                         value={ceo}
//                         onChange={(e) =>
//                           updateCeo(index, e.target.value)
//                         }
//                         placeholder={
//                           index === 0
//                             ? "Enter CEO full name"
//                             : "Another CEO / authorised executive"
//                         }
//                         className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
//                       />

//                       {ceos.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setCeos((current) =>
//                               current.filter(
//                                 (_, i) => i !== index
//                               )
//                             )
//                           }
//                           className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-500"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Contact email */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="mb-2 block text-sm font-medium text-zinc-300"
//                 >
//                   Contact email{" "}
//                   <span className="text-xs font-normal text-zinc-500">
//                     (optional)
//                   </span>
//                 </label>

//                 <input
//                   id="email"
//                   type="email"
//                   value={contactEmail}
//                   onChange={(e) =>
//                     setContactEmail(e.target.value)
//                   }
//                   placeholder="contact@company.com"
//                   className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
//                 />
//               </div>

//               {/* Contact phone */}
//               <div>
//                 <label
//                   htmlFor="phone"
//                   className="mb-2 block text-sm font-medium text-zinc-300"
//                 >
//                   Contact phone{" "}
//                   <span className="text-xs font-normal text-zinc-500">
//                     (optional)
//                   </span>
//                 </label>

//                 <input
//                   id="phone"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   placeholder="+91 ..."
//                   className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
//                 />
//               </div>

//               {/* Address */}
//               <div className="md:col-span-2">
//                 <label
//                   htmlFor="address"
//                   className="mb-2 block text-sm font-medium text-zinc-300"
//                 >
//                   Registered address{" "}
//                   <span className="text-xs font-normal text-zinc-500">
//                     (optional)
//                   </span>
//                 </label>

//                 <input
//                   id="address"
//                   value={address}
//                   onChange={(e) =>
//                     setAddress(e.target.value)
//                   }
//                   placeholder="Street, city, state"
//                   className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
//                 />
//               </div>

//               {/* Notes */}
//               <div className="md:col-span-2">
//                 <label
//                   htmlFor="notes"
//                   className="mb-2 block text-sm font-medium text-zinc-300"
//                 >
//                   Notes{" "}
//                   <span className="text-xs font-normal text-zinc-500">
//                     (optional)
//                   </span>
//                 </label>

//                 <textarea
//                   id="notes"
//                   rows={3}
//                   value={notes}
//                   onChange={(e) =>
//                     setNotes(e.target.value)
//                   }
//                   placeholder="Any additional client information…"
//                   className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Error message */}
//           {error && (
//             <div className="rounded-xl border border-rose-900/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
//               {error}
//             </div>
//           )}

//           {/* Success message */}
//           {saved && (
//             <div className="flex items-center gap-2 rounded-xl border border-emerald-900/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
//               <Check size={16} />
//               Client saved. Returning to Add Tender…
//             </div>
//           )}

//           {/* Form actions */}
//           <div className="sticky bottom-3 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-3 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5">
//             <p className="px-1 text-xs text-zinc-500">
//               Connected to local database.
//             </p>

//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={() =>
//                   navigate("/sales/tenders/new")
//                 }
//                 className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 sm:flex-none"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 disabled={saved || isSubmitting}
//                 className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50 sm:flex-none"
//               >
//                 <Check size={15} className="mr-1.5 inline" />
//                 {isSubmitting ? "Saving..." : "Save client"}
//               </button>
//             </div>
//           </div>
//         </form>

//         {/* Footer */}
//         <footer className="mt-8 border-t border-zinc-800 pt-5 text-xs text-zinc-500">
//           Vikram Engineering · Client directory
//         </footer>
//       </div>
//     </main>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Building2,
  Check,
  ChevronDown,
  CirclePlus,
  Settings2,
  Trash2,
  Users,
} from "lucide-react";

import salesApi from "../services/salesApi";

const CLIENT_TYPES = [
  { value: "GOVT", label: "Government (GOVT)" },
  { value: "PVT", label: "Private (PVT)" },
];

export default function AllClientsForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // Primary Schema Fields
  const [name, setName] = useState(
    location.state?.companyName || location.state?.clientName || ""
  );
  const [type, setType] = useState("GOVT");
  const [contactNo, setContactNo] = useState("");
  const [organisationCEO, setOrganisationCEO] = useState("");

  // Dynamic Metadata (Mapped to othersField)
  const [extraAttributes, setExtraAttributes] = useState([]);

  const [existing, setExisting] = useState([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing clients to catch duplicates client-side
  useEffect(() => {
    salesApi
      .get("/clients") // Adjust to /clients/getClients or /clients depending on your express route prefix
      .then((res) => {
        const clientList = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setExisting(clientList);
      })
      .catch((err) => {
        console.error("Failed to load existing clients", err);
      });
  }, []);

  function addAttribute() {
    setExtraAttributes((curr) => [
      ...curr,
      { id: crypto.randomUUID(), name: "", value: "" },
    ]);
  }

  function updateAttribute(id, field, value) {
    setExtraAttributes((curr) =>
      curr.map((attr) => (attr.id === id ? { ...attr, [field]: value } : attr))
    );
  }

  function removeAttribute(id) {
    setExtraAttributes((curr) => curr.filter((attr) => attr.id !== id));
  }

  async function saveClient(event) {
    event.preventDefault();
    setError("");

    const clientName = name.trim();
    const phone = contactNo.trim();

    if (!clientName || !type || !phone) {
      setError("Client name, entity type, and contact number are required.");
      return;
    }

    // Convert custom key-value attributes into an object for othersField (Mongoose Map)
    const othersObject = extraAttributes.reduce((acc, curr) => {
      const k = curr.name.trim();
      if (k) acc[k] = curr.value.trim();
      return acc;
    }, {});

    const payload = {
      name: clientName,
      type,
      contactNo: phone,
      organisationCEO: organisationCEO.trim() || undefined,
      others: Object.keys(othersObject).length > 0 ? othersObject : undefined,
    };

    setIsSubmitting(true);

    try {
      const res = await salesApi.post("/clients/createClients", payload);
      setSaved(true);

      // Return back to tender form with the newly created client state
      setTimeout(() => {
        navigate("/sales/tenders/new", {
          state: { selectedClient: res.data },
        });
      }, 900);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to save client to server."
      );
      setIsSubmitting(false);
    }
  }

  const duplicate = useMemo(() => {
    const q = name.trim().toLowerCase();
    if (!q) return false;
    return existing.some((c) => (c.name || c.companyName || "").toLowerCase() === q);
  }, [existing, name]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-5 py-7 sm:px-8 lg:px-10">
        {/* Header */}
        <header className="flex flex-col gap-5 border-b border-zinc-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
              <Building2 size={19} />
            </span>

            <span>
              <span className="block text-sm font-semibold tracking-tight text-zinc-100">
                Vikram Engineering
              </span>
              <span className="mt-0.5 block text-[11px] tracking-[0.13em] text-zinc-400">
                ERP WORKSPACE
              </span>
            </span>
          </Link>

          <span className="w-fit rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300">
            CLIENT DIRECTORY
          </span>
        </header>

        {/* Back navigation */}
        <button
          onClick={() => navigate("/sales/tenders/new")}
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
        >
          <ArrowLeft size={16} />
          Back to Add Tender
        </button>

        {/* Page introduction */}
        <section className="mb-8 mt-7">
          <p className="text-xs font-semibold tracking-[0.15em] text-emerald-500">
            NEW CLIENT RECORD
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Add Client
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Register a company, agency, or government entity. This record will immediately be searchable when creating new tenders.
          </p>
        </section>

        {/* Client form */}
        <form onSubmit={saveClient} className="space-y-5">
          {/* Main Info Card */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-zinc-800 pb-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Users size={18} />
              </span>

              <div>
                <h2 className="font-semibold text-zinc-100">
                  Client Information
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Entity name, sector type, and official contact are mandatory.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Client / Company Name */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Client Name <span className="text-rose-500">*</span>
                </label>

                <input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Department of Heavy Industries / L&T Metallics"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                />

                {duplicate && (
                  <p className="mt-2 text-xs text-amber-500">
                    A client with this name already exists in the system directory.
                  </p>
                )}
              </div>

              {/* Type (GOVT / PVT) */}
              <div>
                <label
                  htmlFor="type"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Client Type <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 pr-10 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                  >
                    {CLIENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <label
                  htmlFor="contactNo"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Contact Number <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contactNo"
                  required
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                />
              </div>

              {/* Organisation CEO */}
              <div className="md:col-span-2">
                <label
                  htmlFor="organisationCEO"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Organisation CEO / Authorised Officer{" "}
                  <span className="text-xs font-normal text-zinc-500">
                    (optional)
                  </span>
                </label>
                <input
                  id="organisationCEO"
                  value={organisationCEO}
                  onChange={(e) => setOrganisationCEO(e.target.value)}
                  placeholder="e.g. Dr. A. Sharma"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </section>

          {/* Dynamic Attributes / Others Field */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-300">
                  <Settings2 size={18} />
                </span>
                <div>
                  <h2 className="font-semibold text-zinc-100">
                    Additional Details (Others)
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Add custom fields like GSTIN, official email, or registered office address.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addAttribute}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                <CirclePlus size={16} />
                Add Field
              </button>
            </div>

            {extraAttributes.length > 0 ? (
              <div className="mt-5 space-y-3">
                {extraAttributes.map((attr, idx) => (
                  <div
                    key={attr.id}
                    className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end"
                  >
                    <div>
                      <label
                        htmlFor={`attr-name-${attr.id}`}
                        className="mb-1 block text-xs font-medium text-zinc-400"
                      >
                        Field Name
                      </label>
                      <input
                        id={`attr-name-${attr.id}`}
                        value={attr.name}
                        onChange={(e) =>
                          updateAttribute(attr.id, "name", e.target.value)
                        }
                        placeholder={
                          idx === 0
                            ? "e.g. Email"
                            : idx === 1
                            ? "e.g. Address"
                            : "Custom key"
                        }
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`attr-value-${attr.id}`}
                        className="mb-1 block text-xs font-medium text-zinc-400"
                      >
                        Value
                      </label>
                      <input
                        id={`attr-value-${attr.id}`}
                        value={attr.value}
                        onChange={(e) =>
                          updateAttribute(attr.id, "value", e.target.value)
                        }
                        placeholder="Enter value"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeAttribute(attr.id)}
                      className="grid h-10 w-10 place-items-center rounded-xl text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-xl border border-dashed border-zinc-800 px-4 py-5 text-center text-sm text-zinc-500">
                No custom details added.
              </p>
            )}
          </section>

          {/* Feedback Messages */}
          {error && (
            <div className="rounded-xl border border-rose-900/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
              {error}
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-900/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              <Check size={16} />
              Client created. Redirecting to tender registration…
            </div>
          )}

          {/* Form Actions */}
          <div className="sticky bottom-3 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-3 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="px-1 text-xs text-zinc-500">
              Client will be indexed for instant tender linking.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate("/sales/tenders/new")}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 sm:flex-none"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saved || isSubmitting}
                className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50 sm:flex-none"
              >
                <Check size={15} className="mr-1.5 inline" />
                {isSubmitting ? "Saving..." : "Save Client"}
              </button>
            </div>
          </div>
        </form>

        <footer className="mt-8 border-t border-zinc-800 pt-5 text-xs text-zinc-500">
          Vikram Engineering · Client directory
        </footer>
      </div>
    </main>
  );
}