import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tabs, Tab, Box, Paper, Button, TextField, Select, MenuItem, 
  InputLabel, FormControl, Chip 
} from '@mui/material';
import { 
  Briefcase, Users, FileText, MessageSquareCode, CheckCircle, 
  UploadCloud, Send, FileCheck2
} from 'lucide-react';

// --- Framer Motion Variants ---
const tabVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

// --- Mock Data ---
const mockEnquiries = [
  { id: 'ENQ-01', client: 'Dept of Defense', project: 'PRJ-GOV-884', query: 'Status update on Spec-7 Castings phase 2?', status: 'Pending' },
  { id: 'ENQ-02', client: 'BuildCorp Inc.', project: 'PRJ-MKT-201', query: 'Can we adjust the carbon rod delivery schedule?', status: 'Addressed' },
];

const mockSanctionedProjects = [
  { id: 'PRJ-GOV-884', name: 'High-Grade Titanium Alloy Rods', client: 'Dept of Defense' },
  { id: 'PRJ-MKT-201', name: 'Structural Carbon Steel Billets', client: 'BuildCorp Inc.' },
];

const textFieldSx = {
    '& .MuiInputBase-input': {
        color: 'white',
    },
    '& .MuiInputLabel-root': {
        color: '#94a3b8',
    },
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(2, 6, 23, 0.5)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#334155',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#64748b',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#f59e0b',
    },
};

export default function SalesDashboard() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Briefcase className="text-blue-500 w-8 h-8" />
            Sales & Marketing Hub
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Manage client interactions, daily operations, relationship queries, and sanctioned project demands.
          </p>
        </div>

        {/* Dashboard Tabs */}
        <Paper elevation={0} className="!bg-slate-900/50 !border !border-slate-800 !rounded-xl overflow-hidden mb-8">
          <Tabs 
            value={activeTab} 
            onChange={(e, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ style: { backgroundColor: '#3b82f6', height: '3px' } }}
            sx={{ '& .MuiTab-root': { color: '#94a3b8', textTransform: 'none', fontSize: '0.95rem' }, '& .Mui-selected': { color: '#3b82f6 !important', fontWeight: 'bold' } }}
          >
            <Tab icon={<Users className="w-4 h-4 mb-1" />} label="Clients" />
            <Tab icon={<FileText className="w-4 h-4 mb-1" />} label="Daily Ops" />
            <Tab icon={<MessageSquareCode className="w-4 h-4 mb-1" />} label="Relationship Mgmt" />
            <Tab icon={<FileCheck2 className="w-4 h-4 mb-1" />} label="Client Acceptance" />
          </Tabs>
        </Paper>

        <Box className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* --- 1. CLIENTS (Interactions & Project Flags) --- */}
            {activeTab === 0 && (
              <motion.div key="clients" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                <Paper className="!bg-slate-900/80 !border !border-slate-800 !p-8 !rounded-2xl !shadow-2xl">
                  <h2 className="text-xl font-bold text-white mb-2">Log Client Interaction</h2>
                  <p className="text-sm text-slate-400 mb-6">Upload interactions client-wise and tag them under a specific project flag.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField fullWidth label="Client Name" variant="outlined" sx={textFieldSx} InputLabelProps={{ className: '!text-slate-400' }} InputProps={{ className: '!text-white !bg-slate-950/50' }} />
                    <FormControl fullWidth className="!bg-slate-950/50 !rounded-lg">
                      <InputLabel className="!text-slate-400">Project Flag</InputLabel>
                      <Select label="Project Flag" defaultValue="PRJ-GOV-884" className="!text-white">
                        <MenuItem value="PRJ-GOV-884">PRJ-GOV-884</MenuItem>
                        <MenuItem value="PRJ-MKT-201">PRJ-MKT-201</MenuItem>
                        <MenuItem value="draft">New Draft Project</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField fullWidth className="md:col-span-2" label="Interaction Notes / Minutes of Meeting" multiline rows={3} variant="outlined" sx={textFieldSx} InputLabelProps={{ className: '!text-slate-400' }} InputProps={{ className: '!text-white !bg-slate-950/50' }} />
                  </div>
                  
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="mt-6">
                    <Button variant="contained" className="!bg-blue-500 hover:!bg-blue-600 !text-white !font-bold !py-3 !px-6 !rounded-xl flex gap-2">
                      <Send className="w-4 h-4" /> Save Interaction
                    </Button>
                  </motion.div>
                </Paper>
              </motion.div>
            )}

            {/* --- 2. DAILY OPERATIONS (Notes Upload) --- */}
            {activeTab === 1 && (
              <motion.div key="daily-ops" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                <Paper className="!bg-slate-900/80 !border !border-slate-800 !p-8 !rounded-2xl !shadow-2xl">
                  <h2 className="text-xl font-bold text-white mb-2">Daily Operations Log</h2>
                  <p className="text-sm text-slate-400 mb-6">Upload daily operations notes in Word or PDF format.</p>
                  
                  <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 transition-colors rounded-xl p-12 flex flex-col items-center justify-center bg-slate-950/30 cursor-pointer">
                    <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
                    <p className="text-slate-300 font-medium">Drag & drop Word (.docx) or PDF files here</p>
                    <p className="text-xs text-slate-500 mt-1">Files will be securely stored via Cloudflare R2.</p>
                  </div>
                </Paper>
              </motion.div>
            )}

            {/* --- 3. RELATIONSHIP MANAGEMENT (Enquiries) --- */}
            {activeTab === 2 && (
              <motion.div key="relationship" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                <Paper className="!bg-slate-900/80 !border !border-slate-800 !p-8 !rounded-2xl !shadow-2xl">
                  <h2 className="text-xl font-bold text-white mb-2">Client Enquiries</h2>
                  <p className="text-sm text-slate-400 mb-6">Address client enquiries categorized project and client-wise.</p>
                  
                  <div className="space-y-4">
                    {mockEnquiries.map((enq) => (
                      <div key={enq.id} className="p-5 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-slate-700 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white">{enq.client}</span>
                              <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">{enq.project}</span>
                            </div>
                            <p className="text-sm text-slate-300">{enq.query}</p>
                          </div>
                          <Chip 
                            label={enq.status} 
                            size="small" 
                            className={`!font-medium ${enq.status === 'Addressed' ? '!bg-emerald-500/10 !text-emerald-400 !border !border-emerald-500/20' : '!bg-amber-500/10 !text-amber-400 !border !border-amber-500/20'}`} 
                          />
                        </div>
                        {enq.status === 'Pending' && (
                          <div className="mt-4 flex gap-3">
                            <TextField size="small" fullWidth placeholder="Type response..." sx={textFieldSx} InputProps={{ className: '!text-white !bg-slate-900' }} />
                            <Button variant="contained" className="!bg-blue-500 hover:!bg-blue-600 !text-white !shrink-0">Reply</Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Paper>
              </motion.div>
            )}

            {/* --- 4. CLIENT ACCEPTANCE (Project Demands) --- */}
            {activeTab === 3 && (
              <motion.div key="acceptance" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                <Paper className="!bg-slate-900/80 !border !border-slate-800 !p-8 !rounded-2xl !shadow-2xl">
                  <h2 className="text-xl font-bold text-white mb-2">Sanctioned Projects & Demands</h2>
                  <p className="text-sm text-slate-400 mb-6">
                    Update relations and demands for projects that have been sanctioned and propagated across departments[cite: 1].
                  </p>
                  
                  <div className="space-y-6">
                    {mockSanctionedProjects.map((proj) => (
                      <div key={proj.id} className="p-6 rounded-xl border border-slate-800 bg-slate-950/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
                          <div>
                            <h3 className="text-lg font-bold text-white">{proj.name}</h3>
                            <div className="text-sm text-slate-400 mt-1">Client: {proj.client} | ID: <span className="text-blue-400 font-mono">{proj.id}</span></div>
                          </div>
                          <Chip icon={<CheckCircle className="w-4 h-4" />} label="Sanctioned & Propagated" className="!bg-emerald-500/10 !text-emerald-400 !border !border-emerald-500/20" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextField fullWidth label="Update Client Demands / Specs" multiline rows={2} variant="outlined" sx={textFieldSx} InputLabelProps={{ className: '!text-slate-400' }} InputProps={{ className: '!text-white !bg-slate-900' }} />
                          <TextField fullWidth label="Log Contract/Relation Updates" multiline rows={2} variant="outlined" sx={textFieldSx} InputLabelProps={{ className: '!text-slate-400' }} InputProps={{ className: '!text-white !bg-slate-900' }} />
                        </div>
                        <Button variant="outlined" className="!mt-4 !text-blue-400 !border-blue-500/50 hover:!border-blue-400 hover:!bg-blue-500/10">
                          Sync Updates to Project Pipeline
                        </Button>
                      </div>
                    ))}
                  </div>
                </Paper>
              </motion.div>
            )}

          </AnimatePresence>
        </Box>
      </div>
    </div>
  );
}