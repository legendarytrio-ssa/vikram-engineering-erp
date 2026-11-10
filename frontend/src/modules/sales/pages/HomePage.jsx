// import { useEffect, useState, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import {
//   ArrowUpRight,
//   ChevronDown,
//   ChevronUp,
//   ClipboardList,
//   FilePlus2,
//   FileUp,
//   Sparkles,
//   Trash2,
//   Users,
//   Download, // Added Download icon
// } from "lucide-react";

// import Header from "../components/landing/Header";
// import Metric from "../components/landing/Metric";
// import salesApi from "../services/salesApi";

// export default function HomePage() {
//   const navigate = useNavigate();

//   const [tenders, setTenders] = useState([]);
//   const [clients, setClients] = useState([]);
  
//   const [expandedTender, setExpandedTender] = useState(null);
//   const [expandedClient, setExpandedClient] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);

//   const fetchData = () => {
//     salesApi.get("/tenders/getTenders").then((res) => setTenders(res.data)).catch(console.error);
//     salesApi.get("/clients/getAllClients").then((res) => setClients(res.data)).catch(console.error);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // --- DOWNLOAD HANDLER ---
//   const handleDownloadFile = async (routePrefix, fileKey, originalName) => {
//     try {
//       const res = await salesApi.get(`/${routePrefix}/download-file`, {
//         params: { fileKey, originalName }
//       });
      
//       // Invisible anchor technique to seamlessly download without navigating away
//       const link = document.createElement("a");
//       link.href = res.data.url;
//       link.setAttribute("download", originalName);
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//     } catch (err) {
//       console.error("Failed to fetch secure download link", err);
//     }
//   };

//   // --- TENDER FILE HANDLERS ---
//   const handleAddTenderFile = async (e, tenderId) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     const formData = new FormData();
//     Array.from(files).forEach((file) => formData.append("tenderDocs", file));

//     setIsUploading(true);
//     try {
//       const res = await salesApi.post(`/tenders/${tenderId}/files`, formData);
//       setTenders((prev) => prev.map((t) => (t._id === tenderId ? res.data : t)));
//     } catch (err) {
//       console.error("Upload failed", err);
//     } finally {
//       setIsUploading(false);
//       e.target.value = null; 
//     }
//   };

//   const handleDeleteTenderFile = async (tenderId, fileKey) => {
//     try {
//       const res = await salesApi.delete(`/tenders/${tenderId}/files`, { data: { fileKey } });
//       setTenders((prev) => prev.map((t) => (t._id === tenderId ? res.data : t)));
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
//   };

//   // --- CLIENT FILE HANDLERS ---
//   const handleAddClientFile = async (e, clientId) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     const formData = new FormData();
//     Array.from(files).forEach((file) => formData.append("clientDocs", file));

//     setIsUploading(true);
//     try {
//       const res = await salesApi.post(`/clients/${clientId}/files`, formData);
//       setClients((prev) => prev.map((c) => (c._id === clientId ? res.data : c)));
//     } catch (err) {
//       console.error("Upload failed", err);
//     } finally {
//       setIsUploading(false);
//       e.target.value = null; 
//     }
//   };

//   const handleDeleteClientFile = async (clientId, fileKey) => {
//     try {
//       const res = await salesApi.delete(`/clients/${clientId}/files`, { data: { fileKey } });
//       setClients((prev) => prev.map((c) => (c._id === clientId ? res.data : c)));
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-zinc-950 text-zinc-100">
//       <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 lg:px-10">
//         <Header eyebrow="OVERVIEW" />

//         <section className="grid gap-10 pb-14 pt-12 md:grid-cols-[1.3fr_0.7fr] md:items-end md:pt-20">
//           <div>
//             <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300">
//               <Sparkles size={13} className="text-emerald-400" />
//               Your tender desk
//             </div>

//             <h1 className="max-w-2xl text-4xl font-semibold leading-[1.1] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
//               Good work starts with a <span className="text-emerald-400">clear record.</span>
//             </h1>

//             <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
//               Keep tender details, client contacts, and the next steps in one quiet, organised workspace.
//             </p>

//             <button
//               onClick={() => navigate("/sales/tenders/new")}
//               className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-500"
//             >
//               <FilePlus2 size={17} />
//               Add Tender
//               <ArrowUpRight size={16} />
//             </button>
//           </div>

//           <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-6">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium text-zinc-300">Workspace snapshot</span>
//               <ClipboardList size={18} className="text-zinc-500" />
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3">
//               <Metric label="Tenders saved" value={tenders.length} />
//               <Metric label="Client records" value={clients.length} />
//             </div>

//             <div className="mt-5 flex items-start gap-3 rounded-xl bg-zinc-950 p-4">
//               <span className="mt-0.5 rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
//                 <Users size={16} />
//               </span>
//               <div>
//                 <p className="text-sm font-semibold text-zinc-200">Start with your client list</p>
//                 <p className="mt-1 text-xs leading-5 text-zinc-400">
//                   Company and CEO records power the linked fields in each tender.
//                 </p>
//                 <Link
//                   to="/sales/clients/new"
//                   className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
//                 >
//                   Add a client <ArrowUpRight size={13} />
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* --- TENDERS SECTION --- */}
//         <section className="border-t border-zinc-800 pt-7 mb-14">
//           <div className="mb-5 flex items-end justify-between gap-3">
//             <div>
//               <p className="text-xs font-semibold tracking-[0.15em] text-zinc-500">RECENT ACTIVITY</p>
//               <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-100">Your tenders</h2>
//             </div>
//             <span className="text-xs text-zinc-500">{tenders.length} total</span>
//           </div>

//           {tenders.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 px-5 py-12 text-center">
//               <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400">
//                 <ClipboardList size={21} />
//               </span>
//               <h3 className="mt-4 text-sm font-semibold text-zinc-200">No tenders yet</h3>
//               <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-zinc-400">
//                 When you add a tender, it will appear here for quick access.
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
//               {tenders.map((tender, index) => {
//                 const isExpanded = expandedTender === tender._id;
//                 const docs = tender.tenderDocs || [];

//                 return (
//                   <div key={tender._id} className={index ? "border-t border-zinc-800" : ""}>
//                     {/* Tender Header Row */}
//                     <div 
//                       onClick={() => setExpandedTender(isExpanded ? null : tender._id)}
//                       className="flex cursor-pointer flex-col gap-2 px-5 py-4 transition hover:bg-zinc-800/50 sm:flex-row sm:items-center sm:justify-between"
//                     >
//                       <div>
//                         <p className="text-sm font-semibold text-zinc-200">
//                           {tender.title || "Untitled tender"}
//                         </p>
//                         <p className="mt-1 text-xs text-zinc-400">
//                           {tender.client?.name || "Unknown Client"} · {tender.code}
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <span className="w-fit rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
//                           {tender.status || "PENDING"}
//                         </span>
//                         {isExpanded ? <ChevronUp size={16} className="text-zinc-500"/> : <ChevronDown size={16} className="text-zinc-500"/>}
//                       </div>
//                     </div>

//                     {/* Expandable File Manager */}
//                     {isExpanded && (
//                       <div className="border-t border-zinc-800/50 bg-zinc-950/50 px-5 py-4">
//                         <div className="flex items-center justify-between mb-3">
//                           <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Tender Attachments</span>
                          
//                           <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
//                             <FilePlus2 size={14} />
//                             {isUploading ? "Uploading..." : "Add File"}
//                             <input 
//                               type="file" 
//                               multiple 
//                               className="hidden" 
//                               disabled={isUploading}
//                               onChange={(e) => handleAddTenderFile(e, tender._id)} 
//                             />
//                           </label>
//                         </div>

//                         {docs.length === 0 ? (
//                           <p className="text-xs text-zinc-600 italic">No files attached.</p>
//                         ) : (
//                           <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
//                             {docs.map((doc) => (
//                               <div key={doc._id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-2.5">
//                                 <div className="flex items-center gap-2 overflow-hidden">
//                                   <FileUp size={14} className="text-zinc-500 shrink-0" />
//                                   <span className="truncate text-xs text-zinc-300" title={doc.originalName}>
//                                     {doc.originalName}
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center gap-1">
//                                   <button 
//                                     onClick={() => handleDownloadFile("tenders", doc.key, doc.originalName)}
//                                     className="shrink-0 text-emerald-500 hover:text-emerald-400 transition-colors p-1.5 rounded hover:bg-emerald-500/10"
//                                     title="Download File"
//                                   >
//                                     <Download size={14} />
//                                   </button>
//                                   <button 
//                                     onClick={() => handleDeleteTenderFile(tender._id, doc.key)}
//                                     className="shrink-0 text-zinc-500 hover:text-rose-500 transition-colors p-1.5 rounded hover:bg-rose-500/10"
//                                     title="Delete File"
//                                   >
//                                     <Trash2 size={14} />
//                                   </button>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </section>

//         {/* --- CLIENTS SECTION --- */}
//         <section className="border-t border-zinc-800 pt-7">
//           <div className="mb-5 flex items-end justify-between gap-3">
//             <div>
//               <p className="text-xs font-semibold tracking-[0.15em] text-zinc-500">DIRECTORY</p>
//               <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-100">Client Profiles</h2>
//             </div>
//             <span className="text-xs text-zinc-500">{clients.length} total</span>
//           </div>

//           <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
//             {clients.map((client, index) => {
//               const isExpanded = expandedClient === client._id;
//               const docs = client.clientDocs || [];

//               return (
//                 <div key={client._id} className={index ? "border-t border-zinc-800" : ""}>
//                   {/* Client Header Row */}
//                   <div 
//                     onClick={() => setExpandedClient(isExpanded ? null : client._id)}
//                     className="flex cursor-pointer flex-col gap-2 px-5 py-4 transition hover:bg-zinc-800/50 sm:flex-row sm:items-center sm:justify-between"
//                   >
//                     <div>
//                       <p className="text-sm font-semibold text-zinc-200">
//                         {client.name}
//                       </p>
//                       <p className="mt-1 text-xs text-zinc-400">
//                         {client.type} · {client.contactNo}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       {isExpanded ? <ChevronUp size={16} className="text-zinc-500"/> : <ChevronDown size={16} className="text-zinc-500"/>}
//                     </div>
//                   </div>

//                   {/* Expandable File Manager */}
//                   {isExpanded && (
//                     <div className="border-t border-zinc-800/50 bg-zinc-950/50 px-5 py-4">
//                       <div className="flex items-center justify-between mb-3">
//                         <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Client Documents</span>
                        
//                         <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
//                           <FilePlus2 size={14} />
//                           {isUploading ? "Uploading..." : "Add File"}
//                           <input 
//                             type="file" 
//                             multiple 
//                             className="hidden" 
//                             disabled={isUploading}
//                             onChange={(e) => handleAddClientFile(e, client._id)} 
//                           />
//                         </label>
//                       </div>

//                       {docs.length === 0 ? (
//                         <p className="text-xs text-zinc-600 italic">No files attached.</p>
//                       ) : (
//                         <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
//                           {docs.map((doc) => (
//                             <div key={doc._id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-2.5">
//                               <div className="flex items-center gap-2 overflow-hidden">
//                                 <FileUp size={14} className="text-zinc-500 shrink-0" />
//                                 <span className="truncate text-xs text-zinc-300" title={doc.originalName}>
//                                   {doc.originalName}
//                                 </span>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <button 
//                                   onClick={() => handleDownloadFile("clients", doc.key, doc.originalName)}
//                                   className="shrink-0 text-emerald-500 hover:text-emerald-400 transition-colors p-1.5 rounded hover:bg-emerald-500/10"
//                                   title="Download File"
//                                 >
//                                   <Download size={14} />
//                                 </button>
//                                 <button 
//                                   onClick={() => handleDeleteClientFile(client._id, doc.key)}
//                                   className="shrink-0 text-zinc-500 hover:text-rose-500 transition-colors p-1.5 rounded hover:bg-rose-500/10"
//                                   title="Delete File"
//                                 >
//                                   <Trash2 size={14} />
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         <footer className="mt-12 flex flex-col gap-2 border-t border-zinc-800 pt-5 text-xs text-zinc-500 sm:flex-row sm:justify-between">
//           <span>Vikram Engineering · Internal workspace</span>
//           <span>Client-linked tender records</span>
//         </footer>
//       </div>
//     </main>
//   );
// }



import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  FilePlus2,
  FileUp,
  Sparkles,
  Trash2,
  Users,
  Download,
  Send,
  FileCheck2
} from "lucide-react";

import Header from "../components/landing/Header";
import Metric from "../components/landing/Metric";
import salesApi from "../services/salesApi";

export default function HomePage() {
  const navigate = useNavigate();

  const [tenders, setTenders] = useState([]);
  const [clients, setClients] = useState([]);
  
  const [expandedTender, setExpandedTender] = useState(null);
  const [expandedClient, setExpandedClient] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // State to hold pending PO file selections before sending to CEO
  const [poFileSelections, setPoFileSelections] = useState({});

  const fetchData = () => {
    salesApi.get("/tenders/getTenders").then((res) => setTenders(res.data)).catch(console.error);
    salesApi.get("/clients/getAllClients").then((res) => setClients(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- DOWNLOAD HANDLER ---
  const handleDownloadFile = async (routePrefix, fileKey, originalName) => {
    try {
      const res = await salesApi.get(`/${routePrefix}/download-file`, {
        params: { fileKey, originalName }
      });
      
      const link = document.createElement("a");
      link.href = res.data.url;
      link.setAttribute("download", originalName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Failed to fetch secure download link", err);
    }
  };

  // --- TENDER FILE HANDLERS ---
  const handleAddTenderFile = async (e, tenderId) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("tenderDocs", file));

    setIsUploading(true);
    try {
      const res = await salesApi.post(`/tenders/${tenderId}/files`, formData);
      setTenders((prev) => prev.map((t) => (t._id === tenderId ? res.data : t)));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
      e.target.value = null; 
    }
  };

  const handleDeleteTenderFile = async (tenderId, fileKey) => {
    try {
      const res = await salesApi.delete(`/tenders/${tenderId}/files`, { data: { fileKey } });
      setTenders((prev) => prev.map((t) => (t._id === tenderId ? res.data : t)));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // --- CLIENT FILE HANDLERS ---
  const handleAddClientFile = async (e, clientId) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("clientDocs", file));

    setIsUploading(true);
    try {
      const res = await salesApi.post(`/clients/${clientId}/files`, formData);
      setClients((prev) => prev.map((c) => (c._id === clientId ? res.data : c)));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
      e.target.value = null; 
    }
  };

  const handleDeleteClientFile = async (clientId, fileKey) => {
    try {
      const res = await salesApi.delete(`/clients/${clientId}/files`, { data: { fileKey } });
      setClients((prev) => prev.map((c) => (c._id === clientId ? res.data : c)));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // --- PO ISSUED HANDLER (Send to CEO) ---
  const handlePoFileChange = (e, tenderId) => {
    const files = e.target.files;
    if (files) {
      setPoFileSelections(prev => ({
        ...prev,
        [tenderId]: Array.from(files)
      }));
    }
  };

  const handleSendToCEO = async (tenderId) => {
    const files = poFileSelections[tenderId];
    if (!files || files.length === 0) {
      alert("Please upload at least one Purchase Order (PO) document.");
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append("poDocs", file));

    setIsUploading(true);
    try {
      const res = await salesApi.post(`/tenders/${tenderId}/po-issued`, formData);
      // Update tender list with the returned tender (which now has status PO_ISSUED)
      setTenders((prev) => prev.map((t) => (t._id === tenderId ? res.data.tender : t)));
      
      // Clear selection and close dropdown
      setPoFileSelections(prev => {
        const newState = { ...prev };
        delete newState[tenderId];
        return newState;
      });
      setExpandedTender(null);
    } catch (err) {
      console.error("Failed to send PO to CEO", err);
      alert("Failed to send PO to CEO. Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  // Filter out the APPLIED tenders for the Action section
  const pendingPoTenders = tenders.filter(t => t.status === "APPLIED");
  const generalTenders = tenders.filter(t => t.status !== "APPLIED");

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 lg:px-10">
        <Header eyebrow="OVERVIEW" />

        <section className="grid gap-10 pb-14 pt-12 md:grid-cols-[1.3fr_0.7fr] md:items-end md:pt-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300">
              <Sparkles size={13} className="text-emerald-400" />
              Your tender desk
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.1] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Good work starts with a <span className="text-emerald-400">clear record.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
              Keep tender details, client contacts, and the next steps in one quiet, organised workspace.
            </p>

            <button
              onClick={() => navigate("/sales/tenders/new")}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-500"
            >
              <FilePlus2 size={17} />
              Add Tender
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">Workspace snapshot</span>
              <ClipboardList size={18} className="text-zinc-500" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Metric label="Tenders saved" value={tenders.length} />
              <Metric label="Client records" value={clients.length} />
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-zinc-950 p-4">
              <span className="mt-0.5 rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                <Users size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-200">Start with your client list</p>
                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  Company and CEO records power the linked fields in each tender.
                </p>
                <Link
                  to="/sales/clients/new"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                >
                  Add a client <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- ACTION REQUIRED: APPROVED BIDS (AWAITING PO) --- */}
        {pendingPoTenders.length > 0 && (
          <section className="border-t border-zinc-800 pt-7 mb-14">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.15em] text-amber-500">ACTION REQUIRED</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-100">Approved Bids (Awaiting PO)</h2>
              </div>
              <span className="text-xs text-amber-500 font-medium">{pendingPoTenders.length} pending</span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-amber-900/30 bg-zinc-900 shadow-lg shadow-amber-900/10">
              {pendingPoTenders.map((tender, index) => {
                const isExpanded = expandedTender === tender._id;
                const selectedFiles = poFileSelections[tender._id] || [];

                return (
                  <div key={tender._id} className={index ? "border-t border-zinc-800" : ""}>
                    <div 
                      onClick={() => setExpandedTender(isExpanded ? null : tender._id)}
                      className="flex cursor-pointer flex-col gap-2 px-5 py-4 transition hover:bg-zinc-800/50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-zinc-200">
                          {tender.title || "Untitled tender"}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">
                          {tender.client?.name || "Unknown Client"} · {tender.code}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="w-fit rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                          CEO APPROVED
                        </span>
                        {isExpanded ? <ChevronUp size={16} className="text-zinc-500"/> : <ChevronDown size={16} className="text-zinc-500"/>}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-zinc-800/50 bg-zinc-950/50 px-5 py-5">
                        <div className="flex items-center gap-2 mb-4">
                          <FileCheck2 size={16} className="text-amber-500" />
                          <h3 className="text-sm font-medium text-zinc-200">Upload Winning Purchase Order</h3>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <label className="flex-1 cursor-pointer flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900 py-6 transition hover:border-amber-500/50 hover:bg-zinc-800">
                            <FilePlus2 size={24} className="mb-2 text-zinc-500" />
                            <span className="text-sm font-medium text-zinc-300">Browse PO Documents</span>
                            <span className="text-xs text-zinc-500 mt-1">
                              {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : "PDF, DOCX, etc."}
                            </span>
                            <input 
                              type="file" 
                              multiple 
                              className="hidden" 
                              disabled={isUploading}
                              onChange={(e) => handlePoFileChange(e, tender._id)} 
                            />
                          </label>

                          <div className="flex flex-col justify-end">
                            <button
                              onClick={() => handleSendToCEO(tender._id)}
                              disabled={isUploading || selectedFiles.length === 0}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50 h-fit"
                            >
                              {isUploading ? "Uploading..." : "Send Request to CEO"}
                              <Send size={16} />
                            </button>
                            {selectedFiles.length > 0 && (
                              <p className="text-[10px] text-zinc-500 mt-2 text-center">
                                This will move the tender to Project Conversion.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* --- GENERAL TENDERS SECTION --- */}
        <section className="border-t border-zinc-800 pt-7 mb-14">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] text-zinc-500">RECENT ACTIVITY</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-100">Your tenders</h2>
            </div>
            <span className="text-xs text-zinc-500">{generalTenders.length} total</span>
          </div>

          {generalTenders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 px-5 py-12 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <ClipboardList size={21} />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-zinc-200">No tenders found</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-zinc-400">
                When you add a tender, it will appear here for quick access.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
              {generalTenders.map((tender, index) => {
                const isExpanded = expandedTender === tender._id;
                const docs = tender.tenderDocs || [];

                return (
                  <div key={tender._id} className={index ? "border-t border-zinc-800" : ""}>
                    {/* Tender Header Row */}
                    <div 
                      onClick={() => setExpandedTender(isExpanded ? null : tender._id)}
                      className="flex cursor-pointer flex-col gap-2 px-5 py-4 transition hover:bg-zinc-800/50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-zinc-200">
                          {tender.title || "Untitled tender"}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">
                          {tender.client?.name || "Unknown Client"} · {tender.code}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="w-fit rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                          {tender.status || "PENDING"}
                        </span>
                        {isExpanded ? <ChevronUp size={16} className="text-zinc-500"/> : <ChevronDown size={16} className="text-zinc-500"/>}
                      </div>
                    </div>

                    {/* Expandable File Manager */}
                    {isExpanded && (
                      <div className="border-t border-zinc-800/50 bg-zinc-950/50 px-5 py-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Tender Attachments</span>
                          
                          <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                            <FilePlus2 size={14} />
                            {isUploading ? "Uploading..." : "Add File"}
                            <input 
                              type="file" 
                              multiple 
                              className="hidden" 
                              disabled={isUploading}
                              onChange={(e) => handleAddTenderFile(e, tender._id)} 
                            />
                          </label>
                        </div>

                        {docs.length === 0 ? (
                          <p className="text-xs text-zinc-600 italic">No files attached.</p>
                        ) : (
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {docs.map((doc) => (
                              <div key={doc._id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-2.5">
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <FileUp size={14} className="text-zinc-500 shrink-0" />
                                  <span className="truncate text-xs text-zinc-300" title={doc.originalName}>
                                    {doc.originalName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    onClick={() => handleDownloadFile("tenders", doc.key, doc.originalName)}
                                    className="shrink-0 text-emerald-500 hover:text-emerald-400 transition-colors p-1.5 rounded hover:bg-emerald-500/10"
                                    title="Download File"
                                  >
                                    <Download size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteTenderFile(tender._id, doc.key)}
                                    className="shrink-0 text-zinc-500 hover:text-rose-500 transition-colors p-1.5 rounded hover:bg-rose-500/10"
                                    title="Delete File"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* --- CLIENTS SECTION --- */}
        <section className="border-t border-zinc-800 pt-7">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] text-zinc-500">DIRECTORY</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-100">Client Profiles</h2>
            </div>
            <span className="text-xs text-zinc-500">{clients.length} total</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            {clients.map((client, index) => {
              const isExpanded = expandedClient === client._id;
              const docs = client.clientDocs || [];

              return (
                <div key={client._id} className={index ? "border-t border-zinc-800" : ""}>
                  {/* Client Header Row */}
                  <div 
                    onClick={() => setExpandedClient(isExpanded ? null : client._id)}
                    className="flex cursor-pointer flex-col gap-2 px-5 py-4 transition hover:bg-zinc-800/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">
                        {client.name}
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">
                        {client.type} · {client.contactNo}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {isExpanded ? <ChevronUp size={16} className="text-zinc-500"/> : <ChevronDown size={16} className="text-zinc-500"/>}
                    </div>
                  </div>

                  {/* Expandable File Manager */}
                  {isExpanded && (
                    <div className="border-t border-zinc-800/50 bg-zinc-950/50 px-5 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Client Documents</span>
                        
                        <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                          <FilePlus2 size={14} />
                          {isUploading ? "Uploading..." : "Add File"}
                          <input 
                            type="file" 
                            multiple 
                            className="hidden" 
                            disabled={isUploading}
                            onChange={(e) => handleAddClientFile(e, client._id)} 
                          />
                        </label>
                      </div>

                      {docs.length === 0 ? (
                        <p className="text-xs text-zinc-600 italic">No files attached.</p>
                      ) : (
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {docs.map((doc) => (
                            <div key={doc._id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-2.5">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <FileUp size={14} className="text-zinc-500 shrink-0" />
                                <span className="truncate text-xs text-zinc-300" title={doc.originalName}>
                                  {doc.originalName}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => handleDownloadFile("clients", doc.key, doc.originalName)}
                                  className="shrink-0 text-emerald-500 hover:text-emerald-400 transition-colors p-1.5 rounded hover:bg-emerald-500/10"
                                  title="Download File"
                                >
                                  <Download size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteClientFile(client._id, doc.key)}
                                  className="shrink-0 text-zinc-500 hover:text-rose-500 transition-colors p-1.5 rounded hover:bg-rose-500/10"
                                  title="Delete File"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <footer className="mt-12 flex flex-col gap-2 border-t border-zinc-800 pt-5 text-xs text-zinc-500 sm:flex-row sm:justify-between">
          <span>Vikram Engineering · Internal workspace</span>
          <span>Client-linked tender records</span>
        </footer>
      </div>
    </main>
  );
}