// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Tabs, Tab, Box, Paper, Chip, Button, CircularProgress, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
// import { ShieldAlert, Globe, CheckCircle2, XCircle, ArrowRightCircle, FolderPlus, FileUp, Download, Eye, FilePlus2, X } from 'lucide-react';
// import salesApi from '../../sales/services/salesApi';

// const tabVariants = {
//   hidden: { opacity: 0, y: 15 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
//   exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
// };

// export default function CEODashboard() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [tenders, setTenders] = useState([]);
//   const [projects, setProjects] = useState([]); 
//   const [loading, setLoading] = useState(true);

//   // States for Modals and Uploads
//   const [appFileSelections, setAppFileSelections] = useState({});
//   const [isUploading, setIsUploading] = useState(false);
//   const [telemetryProject, setTelemetryProject] = useState(null);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const tenderRes = await salesApi.get("/tenders/getTenders");
//       const tenderData = Array.isArray(tenderRes.data) ? tenderRes.data : tenderRes.data?.data || [];
//       setTenders(tenderData);

//       // Replace with your actual configured axios instance if needed
//       const projectRes = await axios.get("http://localhost:3000/api/operations/projects");
//       const projectData = Array.isArray(projectRes.data) ? projectRes.data : projectRes.data?.data || [];
//       setProjects(projectData);
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const pendingTenders = tenders.filter(t => t.status === "PENDING");
//   const poIssuedTenders = tenders.filter(t => t.status === "PO_ISSUED");

//   // --- FILE HANDLING (VIEW & DOWNLOAD) ---
//   const handleDownloadFile = async (fileKey, originalName) => {
//     try {
//       const res = await salesApi.get(`/tenders/download-file`, { params: { fileKey, originalName } });
//       const link = document.createElement("a");
//       link.href = res.data.url;
//       link.setAttribute("download", originalName);
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//     } catch (err) {
//       console.error("Download failed", err);
//     }
//   };

//   const handleViewFile = async (fileKey, originalName) => {
//     try {
//       const res = await salesApi.get(`/tenders/view-file`, { params: { fileKey, originalName } });
//       window.open(res.data.url, '_blank', 'noopener,noreferrer');
//     } catch (err) {
//       console.error("View failed", err);
//     }
//   };

//   // --- FILE HANDLING (PROJECT UPLOAD) ---
//   const handleProjectFileUpload = async (e, projectId, targetVault) => {
//     if (!e.target.files || e.target.files.length === 0) return;

//     const formData = new FormData();
//     formData.append("targetVault", targetVault);
//     Array.from(e.target.files).forEach(f => formData.append("projectDocs", f));

//     setIsUploading(true);
//     try {
//       // Point this to wherever you mounted the new Project file upload route
//       const res = await axios.post(`http://localhost:3000/api/projects/${projectId}/files`, formData);

//       // Update the projects state to instantly show the new file
//       setProjects(prev => prev.map(p => p._id === projectId ? res.data : p));

//       // If modal is open, update the modal's state too
//       if (telemetryProject && telemetryProject._id === projectId) {
//         setTelemetryProject(res.data);
//       }
//     } catch (err) {
//       console.error("Failed to upload project file", err);
//       alert("Upload failed. Check console.");
//     } finally {
//       setIsUploading(false);
//       e.target.value = null;
//     }
//   };

//   const handleAction = async (id, action) => {
//     try {
//       setIsUploading(true);

//       if (action === 'convert') {
//         await salesApi.post(`/tenders/${id}/convert`);
//       } else if (action === 'approve') {
//         const files = appFileSelections[id] || [];
//         if (files.length > 0) {
//           const formData = new FormData();
//           files.forEach(f => formData.append("applicationDocs", f));
//           await salesApi.patch(`/tenders/${id}/approve`, formData);
//         } else {
//           await salesApi.patch(`/tenders/${id}/approve`);
//         }
//       } else {
//         await salesApi.patch(`/tenders/${id}/${action}`);
//       }

//       setTenders(prev => prev.filter(t => t._id !== id));

//       if (action === 'convert') {
//          fetchDashboardData();
//          setActiveTab(2); 
//       }
//     } catch (error) {
//       console.error(`Failed to ${action} tender`, error);
//       alert(`Failed to ${action} tender. Check console.`);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // --- REUSABLE UI COMPONENT: SCROLL-SAFE DOCUMENT LIST ---
//   // Added max-h-[220px] and overflow-y-auto to fix the UI breaking issue
//   const DocumentList = ({ title, docs, onUpload, uploadLabel }) => {
//     const safeDocs = Array.isArray(docs) ? docs : [];

//     return (
//       <div className="mt-5 border-t border-zinc-800/50 pt-4">
//         <div className="flex items-center justify-between mb-3">
//           <span className="block text-xs font-bold text-zinc-500 tracking-wider uppercase">{title}</span>

//           {onUpload && (
//             <label className="cursor-pointer inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
//               <FilePlus2 size={14} />
//               {isUploading ? "Wait..." : (uploadLabel || "Add File")}
//               <input type="file" multiple className="hidden" disabled={isUploading} onChange={onUpload} />
//             </label>
//           )}
//         </div>

//         <div className="grid gap-2 sm:grid-cols-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
//           {safeDocs.length === 0 ? (
//             <p className="text-xs text-zinc-600 italic">No files available.</p>
//           ) : (
//             safeDocs.map((doc) => (
//               <div key={doc._id || doc.key} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-2.5">
//                 <div className="flex items-center gap-2 overflow-hidden pr-2">
//                   <FileUp size={14} className="text-zinc-500 shrink-0" />
//                   <span className="truncate text-xs text-zinc-300" title={doc.originalName}>{doc.originalName}</span>
//                 </div>
//                 <div className="flex items-center gap-1 shrink-0">
//                   <button onClick={() => handleViewFile(doc.key, doc.originalName)} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded" title="View in Browser">
//                     <Eye size={14}/>
//                   </button>
//                   <button onClick={() => handleDownloadFile(doc.key, doc.originalName)} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded" title="Download">
//                     <Download size={14}/>
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Find the originating tender for the selected project to pull legacy bidding docs
//   const activeTenderData = telemetryProject 
//     ? tenders.find(t => t._id === (telemetryProject.tender?._id || telemetryProject.tender)) 
//     : null;

//   return (
//     <div className="min-h-screen bg-[#09090b] text-slate-100 p-6 md:p-12 font-sans selection:bg-amber-500/30">

//       {/* CSS injection for clean dark-mode scrollbars in the file lists */}
//       <style dangerouslySetInnerHTML={{__html: `
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #3f3f46; border-radius: 20px; }
//       `}} />

//       <div className="max-w-6xl mx-auto">

//         {/* Header */}
//         <div className="mb-8 border-b border-zinc-800 pb-6">
//           <h1 className="text-3xl font-bold text-white flex items-center gap-3">
//             <Globe className="text-amber-500 w-8 h-8" />
//             Executive Oversight
//           </h1>
//           <p className="text-zinc-400 mt-2 text-sm">
//             Tender sanctioning pipeline and cross-departmental project telemetry.
//           </p>
//         </div>

//         {/* Navigation Tabs */}
//         <Paper elevation={0} className="!bg-zinc-900/50 !border !border-zinc-800 !rounded-xl overflow-hidden mb-8">
//           <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} TabIndicatorProps={{ style: { backgroundColor: '#f59e0b', height: '3px' } }} sx={{ '& .MuiTab-root': { color: '#94a3b8', textTransform: 'none', fontSize: '1rem' }, '& .Mui-selected': { color: '#f59e0b !important', fontWeight: 'bold' } }}>
//             <Tab icon={<ShieldAlert className="w-5 h-5 mb-1" />} label="Sanctioning Engine" />
//             <Tab icon={<FolderPlus className="w-5 h-5 mb-1" />} label="Project Conversion" />
//             <Tab icon={<Globe className="w-5 h-5 mb-1" />} label="Global Project Overview" />
//           </Tabs>
//         </Paper>

//         <Box className="relative min-h-[500px]">
//           <AnimatePresence mode="wait">

//             {/* 1. SANCTIONING ENGINE (Pending Tenders) */}
//             {activeTab === 0 && (
//                // ... (Keep existing Sanctioning Engine code here) ...
//                <motion.div key="sanctioning" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
//                <Paper className="!bg-zinc-900/80 !border !border-zinc-800 !p-8 !rounded-2xl !shadow-2xl">
//                  <div className="flex justify-between items-center mb-6">
//                    <h2 className="text-xl font-bold text-white">Tenders Awaiting Approval</h2>
//                    <Chip label={`${pendingTenders.length} Pending`} size="small" className="!bg-amber-500/10 !text-amber-500 !border !border-amber-500/20" />
//                  </div>

//                  {loading ? (
//                    <div className="flex justify-center py-12"><CircularProgress size={30} sx={{ color: '#f59e0b' }} /></div>
//                  ) : (
//                    <div className="space-y-6">
//                      {pendingTenders.map((tender) => {
//                        const selectedFiles = appFileSelections[tender._id] || [];
//                        return (
//                          <div key={tender._id} className="p-6 rounded-xl border border-zinc-700 bg-zinc-950/50 transition-all">
//                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//                              <div className="flex-1">
//                                <div className="flex items-center gap-3 mb-2">
//                                  <span className="font-mono text-sm font-bold text-amber-400">{tender.code}</span>
//                                  <Chip label={tender.category} size="small" className="!bg-zinc-800 !text-zinc-300" />
//                                </div>
//                                <h3 className="text-lg font-semibold text-white">{tender.title}</h3>
//                                <DocumentList title="Initial Sales Documents" docs={tender.tenderDocs} />
//                              </div>

//                              <div className="flex flex-col gap-3 shrink-0 min-w-[280px] bg-zinc-900 p-4 rounded-xl border border-zinc-800">
//                                <span className="text-xs font-semibold text-zinc-300">ATTACH APPLICATION DOCS</span>
//                                <label className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-950 py-4 cursor-pointer hover:border-emerald-500/50 transition">
//                                  <FilePlus2 size={20} className="mb-2 text-zinc-500" />
//                                  <span className="text-xs text-zinc-400">{selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : "Browse files"}</span>
//                                  <input type="file" multiple className="hidden" disabled={isUploading} onChange={(e) => setAppFileSelections(prev => ({ ...prev, [tender._id]: Array.from(e.target.files) }))} />
//                                </label>
//                                <div className="flex items-center gap-2 mt-2">
//                                  <Button onClick={() => handleAction(tender._id, 'reject')} disabled={isUploading} variant="outlined" className="!text-rose-400 !border-rose-500/50 hover:!bg-rose-500/10 flex-1">
//                                    <XCircle className="w-4 h-4 mr-1" /> Discard
//                                  </Button>
//                                  <Button onClick={() => handleAction(tender._id, 'approve')} disabled={isUploading} variant="contained" className="!bg-emerald-500 hover:!bg-emerald-600 !text-zinc-900 !font-bold flex-1">
//                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
//                                  </Button>
//                                </div>
//                              </div>
//                            </div>
//                          </div>
//                        );
//                      })}
//                      {pendingTenders.length === 0 && <div className="text-center py-12 text-zinc-500">No pending tenders requiring sanction.</div>}
//                    </div>
//                  )}
//                </Paper>
//              </motion.div>
//             )}

//             {/* 2. PROJECT CONVERSION (PO Issued Tenders) */}
//             {activeTab === 1 && (
//                // ... (Keep existing Project Conversion code here) ...
//                <motion.div key="conversion" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
//                <Paper className="!bg-zinc-900/80 !border !border-zinc-800 !p-8 !rounded-2xl !shadow-2xl">
//                  <div className="flex justify-between items-center mb-6">
//                    <div>
//                      <h2 className="text-xl font-bold text-white">Ready for Project Conversion</h2>
//                      <p className="text-xs text-zinc-400 mt-1">Review the Purchase Orders from Sales before finalizing Project Creation.</p>
//                    </div>
//                    <Chip label={`${poIssuedTenders.length} Awaiting`} size="small" className="!bg-blue-500/10 !text-blue-400 !border !border-blue-500/20" />
//                  </div>

//                  {loading ? (
//                    <div className="flex justify-center py-12"><CircularProgress size={30} sx={{ color: '#3b82f6' }} /></div>
//                  ) : (
//                    <div className="space-y-6">
//                      {poIssuedTenders.map((tender) => (
//                        <div key={tender._id} className="p-6 rounded-xl border border-blue-900/30 bg-blue-950/20 transition-all">
//                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//                            <div className="flex-1">
//                              <div className="flex items-center gap-3 mb-2">
//                                <span className="font-mono text-sm font-bold text-amber-400">{tender.code}</span>
//                                <Chip label="PO SECURED" size="small" className="!bg-blue-900/50 !text-blue-300 font-bold" />
//                              </div>
//                              <h3 className="text-lg font-semibold text-white">{tender.title}</h3>

//                              <DocumentList title="1. Sales Bidding Docs" docs={tender.tenderDocs} />
//                              <DocumentList title="2. CEO Application Docs" docs={tender.applicationDocs} />
//                              <DocumentList title="3. Winning Purchase Orders (PO)" docs={tender.poDocs} />
//                            </div>

//                            <div className="flex flex-col gap-3 shrink-0 min-w-[200px]">
//                              <Button onClick={() => handleAction(tender._id, 'reject')} disabled={isUploading} variant="outlined" className="!text-rose-400 !border-rose-500/50 hover:!bg-rose-500/10 w-full">
//                                <XCircle className="w-4 h-4 mr-2" /> Reject PO
//                              </Button>
//                              <Button onClick={() => handleAction(tender._id, 'convert')} disabled={isUploading} variant="contained" className="!bg-blue-600 hover:!bg-blue-500 !text-white !font-bold w-full">
//                                <FolderPlus className="w-4 h-4 mr-2" /> Create Active Project
//                              </Button>
//                            </div>
//                          </div>
//                        </div>
//                      ))}
//                      {poIssuedTenders.length === 0 && <div className="text-center py-12 text-zinc-500">No tenders currently awaiting project conversion.</div>}
//                    </div>
//                  )}
//                </Paper>
//              </motion.div>
//             )}

//             {/* 3. GLOBAL OVERVIEW (Active Projects) */}
//             {activeTab === 2 && (
//               <motion.div key="overview" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
//                 <Paper className="!bg-zinc-900/80 !border !border-zinc-800 !p-8 !rounded-2xl !shadow-2xl">
//                   <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-xl font-bold text-white">Active Sanctioned Pipelines</h2>
//                     <Chip label={`${projects.length} Total`} size="small" className="!bg-emerald-500/10 !text-emerald-500 !border !border-emerald-500/20" />
//                   </div>

//                   {loading ? (
//                     <div className="flex justify-center py-12"><CircularProgress size={30} sx={{ color: '#10b981' }} /></div>
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {projects.map((proj) => (
//                         <div key={proj._id} className="p-6 rounded-xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-950">
//                           <div className="flex justify-between items-start mb-4">
//                             <div>
//                               <h3 className="text-lg font-bold text-white truncate max-w-[250px]" title={proj.projectName}>{proj.projectName}</h3>
//                               <span className="font-mono text-xs text-amber-400">{proj.projectCode}</span>
//                             </div>
//                             <Chip label={proj.status || "ACTIVE"} size="small" className="!bg-emerald-500/20 !text-emerald-400 !border !border-emerald-500/30" />
//                           </div>

//                           <Button 
//                             onClick={() => setTelemetryProject(proj)} 
//                             className="w-full !mt-6 !bg-zinc-800 hover:!bg-zinc-700 !text-zinc-300"
//                           >
//                             View Full Telemetry <ArrowRightCircle className="w-4 h-4 ml-2" />
//                           </Button>
//                         </div>
//                       ))}
//                       {projects.length === 0 && <div className="col-span-1 md:col-span-2 text-center py-12 text-zinc-500">No active projects found.</div>}
//                     </div>
//                   )}
//                 </Paper>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </Box>
//       </div>

//       {/* --- TELEMETRY MODAL --- */}
//       <Dialog 
//         open={!!telemetryProject} 
//         onClose={() => setTelemetryProject(null)}
//         maxWidth="lg" 
//         fullWidth
//         PaperProps={{ className: "!bg-zinc-950 !border !border-zinc-800 !rounded-2xl" }}
//       >
//         {telemetryProject && (
//           <>
//             <DialogTitle className="!flex !justify-between !items-center !border-b !border-zinc-800 !p-6">
//               <div>
//                 <h2 className="text-xl font-bold text-white">{telemetryProject.projectName}</h2>
//                 <span className="font-mono text-xs text-amber-400">{telemetryProject.projectCode}</span>
//               </div>
//               <IconButton onClick={() => setTelemetryProject(null)} className="!text-zinc-400 hover:!text-white">
//                 <X size={20} />
//               </IconButton>
//             </DialogTitle>

//             <DialogContent className="!p-6 !bg-zinc-950 custom-scrollbar">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//                 {/* LEFT COLUMN: Original Tender Details */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-emerald-400 border-b border-zinc-800 pb-2 mb-4">Originating Tender</h3>
//                   {activeTenderData ? (
//                     <div className="space-y-2">
//                       <DocumentList title="1. Sales Bidding Docs" docs={activeTenderData.tenderDocs} />
//                       <DocumentList title="2. CEO Application Docs" docs={activeTenderData.applicationDocs} />
//                       <DocumentList title="3. Winning Purchase Orders" docs={activeTenderData.poDocs} />
//                     </div>
//                   ) : (
//                     <p className="text-sm text-zinc-500 italic">Originating tender telemetry unavailable or archived.</p>
//                   )}
//                 </div>

//                 {/* RIGHT COLUMN: Live Project Telemetry (Uploadable) */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-blue-400 border-b border-zinc-800 pb-2 mb-4">Active Operations & Finance</h3>
//                   <div className="space-y-2">
//                     <DocumentList 
//                       title="Sales Data: Client Handover" 
//                       docs={telemetryProject.salesData?.documents} 
//                       onUpload={(e) => handleProjectFileUpload(e, telemetryProject._id, 'salesData.documents')}
//                     />
//                     <DocumentList 
//                       title="Operations: QC Docs" 
//                       docs={telemetryProject.operationsData?.qcDocuments} 
//                       onUpload={(e) => handleProjectFileUpload(e, telemetryProject._id, 'operationsData.qcDocuments')}
//                     />
//                     <DocumentList 
//                       title="Operations: Purchase Docs" 
//                       docs={telemetryProject.operationsData?.purchaseDocuments} 
//                       onUpload={(e) => handleProjectFileUpload(e, telemetryProject._id, 'operationsData.purchaseDocuments')}
//                     />
//                     <DocumentList 
//                       title="Finance: Invoices & Tax" 
//                       docs={telemetryProject.financeData?.documents} 
//                       onUpload={(e) => handleProjectFileUpload(e, telemetryProject._id, 'financeData.documents')}
//                     />
//                   </div>
//                 </div>

//               </div>
//             </DialogContent>
//           </>
//         )}
//       </Dialog>

//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, Tab, Box, Paper, Chip, Button, CircularProgress, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { ShieldAlert, Globe, CheckCircle2, XCircle, ArrowRightCircle, FolderPlus, FileUp, Download, Eye, FilePlus2, X } from 'lucide-react';
import salesApi from '../../sales/services/salesApi';

const tabVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

export default function CEODashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [tenders, setTenders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Modals and Uploads
  const [appFileSelections, setAppFileSelections] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [telemetryProject, setTelemetryProject] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const tenderRes = await salesApi.get("/tenders/getTenders");
      const tenderData = Array.isArray(tenderRes.data) ? tenderRes.data : tenderRes.data?.data || [];
      setTenders(tenderData);

      // Replace with your actual configured axios instance if needed
      const projectRes = await axios.get("http://localhost:3000/api/operations/projects");
      const projectData = Array.isArray(projectRes.data) ? projectRes.data : projectRes.data?.data || [];
      setProjects(projectData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pendingTenders = tenders.filter(t => t.status === "PENDING");
  const poIssuedTenders = tenders.filter(t => t.status === "PO_ISSUED");

  // --- FILE HANDLING (VIEW & DOWNLOAD) ---
  const handleDownloadFile = async (fileKey, originalName) => {
    try {
      const res = await salesApi.get(`/tenders/download-file`, { params: { fileKey, originalName } });
      const link = document.createElement("a");
      link.href = res.data.url;
      link.setAttribute("download", originalName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleViewFile = async (fileKey, originalName) => {
    try {
      const res = await salesApi.get(`/tenders/view-file`, { params: { fileKey, originalName } });
      window.open(res.data.url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error("View failed", err);
    }
  };

  // --- FILE HANDLING (PROJECT UPLOAD) ---
  const handleProjectFileUpload = async (e, projectId, targetVault) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const formData = new FormData();
    formData.append("targetVault", targetVault);
    Array.from(e.target.files).forEach(f => formData.append("projectDocs", f));

    setIsUploading(true);
    try {
      // Point this to wherever you mounted the new Project file upload route
      const res = await axios.post(`http://localhost:3000/api/projects/${projectId}/files`, formData);

      // Update the projects state to instantly show the new file
      setProjects(prev => prev.map(p => p._id === projectId ? res.data : p));

      // If modal is open, update the modal's state too
      if (telemetryProject && telemetryProject._id === projectId) {
        setTelemetryProject(res.data);
      }
    } catch (err) {
      console.error("Failed to upload project file", err);
      alert("Upload failed. Check console.");
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleAction = async (id, action) => {
    try {
      setIsUploading(true);

      if (action === 'convert') {
        await salesApi.post(`/tenders/${id}/convert`);
      } else if (action === 'approve') {
        const files = appFileSelections[id] || [];
        if (files.length > 0) {
          const formData = new FormData();
          files.forEach(f => formData.append("applicationDocs", f));
          await salesApi.patch(`/tenders/${id}/approve`, formData);
        } else {
          await salesApi.patch(`/tenders/${id}/approve`);
        }
      } else {
        await salesApi.patch(`/tenders/${id}/${action}`);
      }

      setTenders(prev => prev.filter(t => t._id !== id));

      if (action === 'convert') {
        fetchDashboardData();
        setActiveTab(2);
      }
    } catch (error) {
      console.error(`Failed to ${action} tender`, error);
      alert(`Failed to ${action} tender. Check console.`);
    } finally {
      setIsUploading(false);
    }
  };

  // --- REUSABLE UI COMPONENT: SCROLL-SAFE DOCUMENT LIST ---
  // Added max-h-[220px] and overflow-y-auto to fix the UI breaking issue
  const DocumentList = ({ title, docs, onUpload, uploadLabel }) => {
    const safeDocs = Array.isArray(docs) ? docs : [];

    return (
      <div className="mt-5 border-t border-zinc-800/50 pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="block text-xs font-bold text-zinc-500 tracking-wider uppercase">{title}</span>

          {onUpload && (
            <label className="cursor-pointer inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
              <FilePlus2 size={14} />
              {isUploading ? "Wait..." : (uploadLabel || "Add File")}
              <input type="file" multiple className="hidden" disabled={isUploading} onChange={onUpload} />
            </label>
          )}
        </div>

        <div className="grid max-h-56 gap-2 overflow-y-auto pr-2 custom-scrollbar sm:grid-cols-2">
          {safeDocs.length === 0 ? (
            <p className="text-xs text-zinc-600 italic">No files available.</p>
          ) : (
            safeDocs.map((doc) => (
              <div key={doc._id || doc.key} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
                <div className="flex items-center gap-2 overflow-hidden pr-2">
                  <FileUp size={14} className="text-zinc-500 shrink-0" />
                  <span className="truncate text-xs text-zinc-300" title={doc.originalName}>{doc.originalName}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleViewFile(doc.key, doc.originalName)} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded" title="View in Browser">
                    <Eye size={14} />
                  </button>
                  <button onClick={() => handleDownloadFile(doc.key, doc.originalName)} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded" title="Download">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Find the originating tender for the selected project to pull legacy bidding docs
  const activeTenderData = telemetryProject
    ? tenders.find(t => t._id === (telemetryProject.tender?._id || telemetryProject.tender))
    : null;

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 p-6 md:p-12 font-sans selection:bg-amber-500/30">

      {/* CSS injection for clean dark-mode scrollbars in the file lists */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #3f3f46; border-radius: 20px; }
      `}} />

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 border-b border-slate-800/80 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.07] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              Executive workspace
            </div>
            <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <Globe className="h-8 w-8 text-amber-400" />
              Executive Oversight
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Tender sanctioning pipeline and cross-departmental project telemetry.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Live records</p>
            <p className="mt-1 text-sm font-medium text-slate-200">{tenders.length} tenders <span className="mx-1 text-slate-600">/</span> {projects.length} projects</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Paper elevation={0} className="ceo-tabs mb-7 overflow-hidden !rounded-2xl !border !border-slate-800 !bg-slate-900/75 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.9)]">
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            TabIndicatorProps={{ style: { backgroundColor: '#fbbf24', height: '3px', borderRadius: '3px' } }}
            sx={{
              '& .MuiTab-root': {
                minHeight: 72,
                px: { xs: 2, sm: 3 },
                color: '#94a3b8',
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              },
              '& .MuiTab-root.Mui-selected': { color: '#fbbf24 !important' },
              '& .MuiTabs-scrollButtons': { color: '#cbd5e1' },
            }}
          >
            <Tab icon={<ShieldAlert className="mb-1 h-5 w-5" />} label="Sanctioning Engine" />
            <Tab icon={<FolderPlus className="mb-1 h-5 w-5" />} label="Project Conversion" />
            <Tab icon={<Globe className="mb-1 h-5 w-5" />} label="Global Project Overview" />
          </Tabs>
        </Paper>

        <Box className="relative min-h-0 w-full">
          <AnimatePresence mode="wait" initial={false}>

            {/* 1. SANCTIONING ENGINE (Pending Tenders) */}
            {activeTab === 0 && (
              // ... (Keep existing Sanctioning Engine code here) ...
              <motion.div key="sanctioning" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="relative w-full">
                <Paper className="!rounded-2xl !border !border-slate-800/90 !bg-slate-900/85 !p-4 shadow-[0_24px_80px_-45px_rgba(0,0,0,0.95)] sm:!p-6 lg:!p-8">
                  <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-bold text-white">Tenders Awaiting Approval</h2>
                    <Chip label={`${pendingTenders.length} Pending`} size="small" className="!bg-amber-500/10 !text-amber-500 !border !border-amber-500/20" />
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-12"><CircularProgress size={30} sx={{ color: '#f59e0b' }} /></div>
                  ) : (
                    <div className="space-y-6">
                      {pendingTenders.map((tender) => {
                        const selectedFiles = appFileSelections[tender._id] || [];
                        return (
                          <div key={tender._id} className="p-4 sm:p-6 rounded-xl border border-slate-700/70 bg-slate-950/55 transition-all">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                  <span className="font-mono text-sm font-bold text-amber-400">{tender.code}</span>
                                  <Chip label={tender.category} size="small" className="!bg-zinc-800 !text-zinc-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">{tender.title}</h3>
                                <DocumentList title="Initial Sales Documents" docs={tender.tenderDocs} />
                              </div>

                              <div className="flex flex-col gap-3 w-full shrink-0 md:w-[280px] bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                                <span className="text-xs font-semibold text-zinc-300">ATTACH APPLICATION DOCS</span>
                                <label className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-950 py-4 cursor-pointer hover:border-emerald-500/50 transition">
                                  <FilePlus2 size={20} className="mb-2 text-zinc-500" />
                                  <span className="text-xs text-zinc-400">{selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : "Browse files"}</span>
                                  <input type="file" multiple className="hidden" disabled={isUploading} onChange={(e) => setAppFileSelections(prev => ({ ...prev, [tender._id]: Array.from(e.target.files) }))} />
                                </label>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button onClick={() => handleAction(tender._id, 'reject')} disabled={isUploading} variant="outlined" className="!text-rose-400 !border-rose-500/50 hover:!bg-rose-500/10 flex-1">
                                    <XCircle className="w-4 h-4 mr-1" /> Discard
                                  </Button>
                                  <Button onClick={() => handleAction(tender._id, 'approve')} disabled={isUploading} variant="contained" className="!bg-emerald-500 hover:!bg-emerald-600 !text-zinc-900 !font-bold flex-1">
                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {pendingTenders.length === 0 && <div className="text-center py-12 text-zinc-500">No pending tenders requiring sanction.</div>}
                    </div>
                  )}
                </Paper>
              </motion.div>
            )}

            {/* 2. PROJECT CONVERSION (PO Issued Tenders) */}
            {activeTab === 1 && (
              // ... (Keep existing Project Conversion code here) ...
              <motion.div key="conversion" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="relative w-full">
                <Paper className="!rounded-2xl !border !border-slate-800/90 !bg-slate-900/85 !p-4 shadow-[0_24px_80px_-45px_rgba(0,0,0,0.95)] sm:!p-6 lg:!p-8">
                  <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">Ready for Project Conversion</h2>
                      <p className="text-xs text-zinc-400 mt-1">Review the Purchase Orders from Sales before finalizing Project Creation.</p>
                    </div>
                    <Chip label={`${poIssuedTenders.length} Awaiting`} size="small" className="!bg-blue-500/10 !text-blue-400 !border !border-blue-500/20" />
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-12"><CircularProgress size={30} sx={{ color: '#3b82f6' }} /></div>
                  ) : (
                    <div className="space-y-6">
                      {poIssuedTenders.map((tender) => (
                        <div key={tender._id} className="p-4 sm:p-6 rounded-xl border border-cyan-900/40 bg-cyan-950/20 transition-all">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-3 mb-2">
                                <span className="font-mono text-sm font-bold text-amber-400">{tender.code}</span>
                                <Chip label="PO SECURED" size="small" className="!bg-blue-900/50 !text-blue-300 font-bold" />
                              </div>
                              <h3 className="text-lg font-semibold text-white">{tender.title}</h3>

                              <DocumentList title="1. Sales Bidding Docs" docs={tender.tenderDocs} />
                              <DocumentList title="2. CEO Application Docs" docs={tender.applicationDocs} />
                              <DocumentList title="3. Winning Purchase Orders (PO)" docs={tender.poDocs} />
                            </div>

                            <div className="flex flex-col gap-3 w-full shrink-0 md:w-[200px]">
                              <Button onClick={() => handleAction(tender._id, 'reject')} disabled={isUploading} variant="outlined" className="!text-rose-400 !border-rose-500/50 hover:!bg-rose-500/10 w-full">
                                <XCircle className="w-4 h-4 mr-2" /> Reject PO
                              </Button>
                              <Button onClick={() => handleAction(tender._id, 'convert')} disabled={isUploading} variant="contained" className="!bg-blue-600 hover:!bg-blue-500 !text-white !font-bold w-full">
                                <FolderPlus className="w-4 h-4 mr-2" /> Create Active Project
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {poIssuedTenders.length === 0 && <div className="text-center py-12 text-zinc-500">No tenders currently awaiting project conversion.</div>}
                    </div>
                  )}
                </Paper>
              </motion.div>
            )}

            {/* 3. GLOBAL OVERVIEW (Active Projects) */}
            {activeTab === 2 && (
              <motion.div key="overview" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="relative w-full">
                <Paper className="!rounded-2xl !border !border-slate-800/90 !bg-slate-900/85 !p-4 shadow-[0_24px_80px_-45px_rgba(0,0,0,0.95)] sm:!p-6 lg:!p-8">
                  <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-bold text-white">Active Sanctioned Pipelines</h2>
                    <Chip label={`${projects.length} Total`} size="small" className="!bg-emerald-500/10 !text-emerald-500 !border !border-emerald-500/20" />
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-12"><CircularProgress size={30} sx={{ color: '#10b981' }} /></div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {projects.map((proj) => (
                        <div key={proj._id} className="p-4 sm:p-6 rounded-xl border border-zinc-700 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700/70">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-white truncate max-w-[250px]" title={proj.projectName}>{proj.projectName}</h3>
                              <span className="font-mono text-xs text-amber-400">{proj.projectCode}</span>
                            </div>
                            <Chip label={proj.status || "ACTIVE"} size="small" className="!bg-emerald-500/20 !text-emerald-400 !border !border-emerald-500/30" />
                          </div>

                          <Button
                            onClick={() => setTelemetryProject(proj)}
                            className="w-full !mt-6 !border !border-slate-700 !bg-slate-800 hover:!bg-slate-700 !text-slate-200"
                          >
                            View Full Telemetry <ArrowRightCircle className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      ))}
                      {projects.length === 0 && <div className="col-span-1 md:col-span-2 text-center py-12 text-zinc-500">No active projects found.</div>}
                    </div>
                  )}
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </div>

      {/* --- TELEMETRY MODAL --- */}

      <Dialog
        open={!!telemetryProject}
        onClose={() => setTelemetryProject(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#0b1220",
            color: "#e2e8f0",
            border: "1px solid rgba(71, 85, 105, 0.7)",
            borderRadius: "18px",
            overflow: "hidden",
            backgroundImage: "none",
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.65)",
          },
        }}
      >
        {telemetryProject && (
          <>
            <DialogTitle
              sx={{
                position: "relative",
                isolation: "isolate",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: { xs: "18px", sm: "24px 28px" },
                background: "linear-gradient(110deg, #17243a 0%, #101b2d 55%, #0d1727 100%)",
                borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
                borderTop: "3px solid #d97706",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: "100%",
                  height: "1px",
                  background: "linear-gradient(90deg, #d97706, transparent 75%)",
                },
              }}
            >
              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">
                  Project Telemetry
                </p>

                <h2 className="break-words text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {telemetryProject.projectName}
                </h2>

                <span className="mt-2 inline-block rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-mono text-xs tracking-wider text-amber-400">
                  {telemetryProject.projectCode}
                </span>
              </div>

              <IconButton
                onClick={() => setTelemetryProject(null)}
                sx={{
                  ml: 2,
                  flexShrink: 0,
                  color: "#94a3b8",
                  backgroundColor: "rgba(148, 163, 184, 0.08)",
                  border: "1px solid rgba(148, 163, 184, 0.15)",
                  "&:hover": {
                    color: "#fff",
                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                    borderColor: "rgba(239, 68, 68, 0.4)",
                  },
                }}
              >
                <X size={20} />
              </IconButton>
            </DialogTitle>

            <DialogContent
              sx={{
                padding: { xs: "18px", sm: "28px" },
                backgroundColor: "#0b1220",
                color: "#e2e8f0",
              }}
              className="custom-scrollbar"
            >
              {/* Keep your existing telemetry content here */}

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                {/* LEFT COLUMN: Original Tender Details */}
                <div>
                  <h3 className="text-lg font-semibold text-emerald-400 border-b border-slate-700/80 pb-2 mb-4">Originating Tender</h3>
                  {activeTenderData ? (
                    <div className="space-y-2">
                      <DocumentList title="1. Sales Bidding Docs" docs={activeTenderData.tenderDocs} />
                      <DocumentList title="2. CEO Application Docs" docs={activeTenderData.applicationDocs} />
                      <DocumentList title="3. Winning Purchase Orders" docs={activeTenderData.poDocs} />
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500 italic">Originating tender telemetry unavailable or archived.</p>
                  )}
                </div>

                {/* RIGHT COLUMN: Live Project Telemetry (Uploadable) */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 border-b border-slate-700/80 pb-2 mb-4">Active Operations & Finance</h3>
                  <div className="space-y-2">
                    <DocumentList
                      title="Sales Data: Client Handover"
                      docs={telemetryProject.salesData?.documents}
                      onUpload={(e) => handleProjectFileUpload(e, telemetryProject._id, 'salesData.documents')}
                    />
                    <DocumentList
                      title="Operations: QC Docs"
                      docs={telemetryProject.operationsData?.qcDocuments}
                      onUpload={(e) => handleProjectFileUpload(e, telemetryProject._id, 'operationsData.qcDocuments')}
                    />
                    <DocumentList
                      title="Operations: Purchase Docs"
                      docs={telemetryProject.operationsData?.purchaseDocuments}
                      onUpload={(e) => handleProjectFileUpload(e, telemetryProject._id, 'operationsData.purchaseDocuments')}
                    />
                    <DocumentList
                      title="Finance: Invoices & Tax"
                      docs={telemetryProject.financeData?.documents}
                      onUpload={(e) => handleProjectFileUpload(e, telemetryProject._id, 'financeData.documents')}
                    />
                  </div>
                </div>

              </div>
            </DialogContent>
          </>
        )}
      </Dialog>

    </div>
  );
}