import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, Tab, Box, Paper, Chip, Button, CircularProgress } from '@mui/material';
import { ShieldAlert, Globe, CheckCircle2, XCircle, ArrowRightCircle, FolderPlus } from 'lucide-react';
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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Tenders (Sales Module)
      const tenderRes = await salesApi.get("/tenders/getTenders");
      const tenderData = Array.isArray(tenderRes.data) ? tenderRes.data : tenderRes.data?.data || [];
      setTenders(tenderData);

      // 2. Fetch Live Projects (Operations Module)
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

  // Isolate tenders based on their specific pipeline states
  const pendingTenders = tenders.filter(t => t.status === "PENDING");
  const poIssuedTenders = tenders.filter(t => t.status === "PO_ISSUED");

  const handleAction = async (id, action) => {
    try {
      // Conversion route requires a POST request, approval/rejection requires PATCH
      if (action === 'convert') {
        await salesApi.post(`/tenders/${id}/convert`);
      } else {
        await salesApi.patch(`/tenders/${id}/${action}`);
      }
      
      // Optimistically remove the tender from the current lists
      setTenders((prev) => prev.filter((t) => t._id !== id));
      
      // If converted to a project, refresh the live projects list
      if (action === 'convert') {
         fetchDashboardData();
         // Automatically switch to the Global Overview tab to see the new project
         setActiveTab(2); 
      }
    } catch (error) {
      console.error(`Failed to ${action} tender`, error);
      alert(`Failed to ${action} tender. Check console for details.`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 p-6 md:p-12 font-sans selection:bg-amber-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Globe className="text-amber-500 w-8 h-8" />
            Executive Oversight
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Tender sanctioning pipeline and cross-departmental project telemetry.
          </p>
        </div>

        {/* Navigation Tabs */}
        <Paper elevation={0} className="!bg-zinc-900/50 !border !border-zinc-800 !rounded-xl overflow-hidden mb-8">
          <Tabs 
            value={activeTab} 
            onChange={(e, val) => setActiveTab(val)}
            TabIndicatorProps={{ style: { backgroundColor: '#f59e0b', height: '3px' } }}
            sx={{ 
              '& .MuiTab-root': { color: '#94a3b8', textTransform: 'none', fontSize: '1rem' }, 
              '& .Mui-selected': { color: '#f59e0b !important', fontWeight: 'bold' } 
            }}
          >
            <Tab icon={<ShieldAlert className="w-5 h-5 mb-1" />} label="Sanctioning Engine" />
            <Tab icon={<FolderPlus className="w-5 h-5 mb-1" />} label="Project Conversion" />
            <Tab icon={<Globe className="w-5 h-5 mb-1" />} label="Global Project Overview" />
          </Tabs>
        </Paper>

        <Box className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* 1. SANCTIONING ENGINE (Pending Tenders) */}
            {activeTab === 0 && (
              <motion.div key="sanctioning" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                <Paper className="!bg-zinc-900/80 !border !border-zinc-800 !p-8 !rounded-2xl !shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Tenders Awaiting Approval</h2>
                    <Chip label={`${pendingTenders.length} Pending`} size="small" className="!bg-amber-500/10 !text-amber-500 !border !border-amber-500/20" />
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <CircularProgress size={30} sx={{ color: '#f59e0b' }} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingTenders.map((tender) => (
                        <div key={tender._id} className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-zinc-700">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-mono text-sm font-bold text-amber-400">{tender.code}</span>
                              <Chip label={tender.category} size="small" className="!bg-zinc-800 !text-zinc-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">{tender.title}</h3>
                            <p className="text-sm text-zinc-400 mt-1">
                              Client: <span className="text-zinc-300">{tender.client?.name || tender.client?.companyName || 'Unknown Client'}</span> 
                            </p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                            <Button 
                              onClick={() => handleAction(tender._id, 'reject')}
                              variant="outlined" 
                              className="!text-rose-400 !border-rose-500/50 hover:!bg-rose-500/10 w-full sm:w-auto"
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Discard
                            </Button>
                            <Button 
                              onClick={() => handleAction(tender._id, 'approve')}
                              variant="contained" 
                              className="!bg-emerald-500 hover:!bg-emerald-600 !text-zinc-900 !font-bold w-full sm:w-auto"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Approve Bid
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {pendingTenders.length === 0 && (
                        <div className="text-center py-12 text-zinc-500">
                          No pending tenders requiring sanction.
                        </div>
                      )}
                    </div>
                  )}
                </Paper>
              </motion.div>
            )}

            {/* 2. PROJECT CONVERSION (PO Issued Tenders) */}
            {activeTab === 1 && (
              <motion.div key="conversion" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                <Paper className="!bg-zinc-900/80 !border !border-zinc-800 !p-8 !rounded-2xl !shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">Ready for Project Conversion</h2>
                      <p className="text-xs text-zinc-400 mt-1">Sales has uploaded the Purchase Order. Final CEO sign-off required to go LIVE.</p>
                    </div>
                    <Chip label={`${poIssuedTenders.length} Awaiting`} size="small" className="!bg-blue-500/10 !text-blue-400 !border !border-blue-500/20" />
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <CircularProgress size={30} sx={{ color: '#3b82f6' }} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {poIssuedTenders.map((tender) => (
                        <div key={tender._id} className="p-5 rounded-xl border border-blue-900/30 bg-blue-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-blue-500/50">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-mono text-sm font-bold text-amber-400">{tender.code}</span>
                              <Chip label="PO SECURED" size="small" className="!bg-blue-900/50 !text-blue-300 font-bold" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">{tender.title}</h3>
                            <p className="text-sm text-zinc-400 mt-1">
                              Client: <span className="text-zinc-300">{tender.client?.name || tender.client?.companyName || 'Unknown Client'}</span> 
                            </p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                            {/* NEW: Rejection Button for PO Phase */}
                            <Button 
                              onClick={() => handleAction(tender._id, 'reject')}
                              variant="outlined" 
                              className="!text-rose-400 !border-rose-500/50 hover:!bg-rose-500/10 w-full sm:w-auto"
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Reject PO
                            </Button>
                            <Button 
                              onClick={() => handleAction(tender._id, 'convert')}
                              variant="contained" 
                              className="!bg-blue-600 hover:!bg-blue-500 !text-white !font-bold w-full sm:w-auto"
                            >
                              <FolderPlus className="w-4 h-4 mr-2" /> Create Active Project
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {poIssuedTenders.length === 0 && (
                        <div className="text-center py-12 text-zinc-500">
                          No tenders currently awaiting project conversion.
                        </div>
                      )}
                    </div>
                  )}
                </Paper>
              </motion.div>
            )}

            {/* 3. GLOBAL OVERVIEW (Active Projects) */}
            {activeTab === 2 && (
              <motion.div key="overview" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                <Paper className="!bg-zinc-900/80 !border !border-zinc-800 !p-8 !rounded-2xl !shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Active Sanctioned Pipelines</h2>
                    <Chip label={`${projects.length} Total`} size="small" className="!bg-emerald-500/10 !text-emerald-500 !border !border-emerald-500/20" />
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <CircularProgress size={30} sx={{ color: '#10b981' }} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {projects.map((proj) => (
                        <div key={proj._id} className="p-6 rounded-xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-950 hover:border-zinc-500 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-white truncate max-w-[250px]" title={proj.projectName}>
                                {proj.projectName}
                              </h3>
                              <span className="font-mono text-xs text-amber-400">{proj.projectCode}</span>
                            </div>
                            <Chip 
                              label={proj.status || "ACTIVE"} 
                              size="small" 
                              className={proj.status === "COMPLETED" 
                                ? "!bg-blue-500/20 !text-blue-400 !border !border-blue-500/30" 
                                : "!bg-emerald-500/20 !text-emerald-400 !border !border-emerald-500/30"
                              } 
                            />
                          </div>
                          
                          <div className="space-y-3 mt-6">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-zinc-400">Operations QC Docs:</span>
                              <span className="text-zinc-200 font-medium">
                                {proj.operationsData?.qcDocuments?.length || 0} Files
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-zinc-400">Finance Records:</span>
                              <span className="text-zinc-200 font-medium">
                                {proj.financeData?.documents?.length || 0} Files
                              </span>
                            </div>
                          </div>
                          
                          <Button className="w-full !mt-6 !bg-zinc-800 hover:!bg-zinc-700 !text-zinc-300">
                            View Full Telemetry <ArrowRightCircle className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      ))}

                      {projects.length === 0 && (
                        <div className="col-span-1 md:col-span-2 text-center py-12 text-zinc-500">
                          No active projects found. Convert an approved tender to begin.
                        </div>
                      )}
                    </div>
                  )}
                </Paper>
              </motion.div>
            )}

          </AnimatePresence>
        </Box>
      </div>
    </div>
  );
}