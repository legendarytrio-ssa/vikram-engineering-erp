import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tabs, Tab, Box, Paper, Button, Checkbox, FormControlLabel, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip 
} from '@mui/material';
import { 
  Landmark, Users, Building2, Wallet, CheckCircle2, ArrowRight, CircleDollarSign
} from 'lucide-react';

// --- Framer Motion Variants ---
const tabVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

// --- Mock Data ---
const mockWages = [
  { id: 'EMP-01', name: 'John Doe', role: 'Operations Shift Lead', amount: '$4,200', sanctioned: false },
  { id: 'EMP-02', name: 'Sarah Connor', role: 'QC Inspector', amount: '$3,800', sanctioned: true },
  { id: 'EMP-03', name: 'Mike Ross', role: 'Sales Associate', amount: '$3,500', sanctioned: false },
];

const mockVendors = [
  { project: 'PRJ-GOV-884', vendor: 'Titanium Co.', item: 'Raw Billets', amount: '$125,000', status: 'Pending' },
  { project: 'PRJ-MKT-201', vendor: 'Global Steel', item: 'Carbon Rods', amount: '$45,000', status: 'Paid' },
];

const mockBuyers = [
  { project: 'PRJ-GOV-884', buyer: 'Dept of Defense', item: 'Spec-7 Castings', amount: '$450,000', status: 'Invoice Sent' },
  { project: 'PRJ-MKT-201', buyer: 'BuildCorp Inc.', item: 'Structural Beams', amount: '$85,000', status: 'Settled' },
];

export default function AccountsDashboard() {
  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeFinanceTab, setActiveFinanceTab] = useState(0);
  const [wages, setWages] = useState(mockWages);

  const handleWagesToggle = (id) => {
    setWages(wages.map(w => w.id === id ? { ...w, sanctioned: !w.sanctioned } : w));
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Landmark className="text-emerald-500 w-8 h-8" />
            Accounts & Finance Hub
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Manage monthly employee wage checklists and project-wise operational finance.
          </p>
        </div>

        {/* Main Department Tabs */}
        <Paper elevation={0} className="!bg-slate-900/50 !border !border-slate-800 !rounded-xl overflow-hidden mb-8">
          <Tabs 
            value={activeMainTab} 
            onChange={(e, val) => setActiveMainTab(val)}
            TabIndicatorProps={{ style: { backgroundColor: '#10b981', height: '3px' } }}
            sx={{ '& .MuiTab-root': { color: '#94a3b8', textTransform: 'none', fontSize: '1rem' }, '& .Mui-selected': { color: '#10b981 !important', fontWeight: 'bold' } }}
          >
            <Tab icon={<Users className="w-5 h-5 mb-1" />} label="Monthly Wages" />
            <Tab icon={<Wallet className="w-5 h-5 mb-1" />} label="Operations Finance" />
          </Tabs>
        </Paper>

        <Box className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* --- 1. MONTHLY WAGES SECTION --- */}
            {activeMainTab === 0 && (
              <motion.div key="wages" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                <Paper className="!bg-slate-900/80 !border !border-slate-800 !p-8 !rounded-2xl !shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Wage Sanction Checklist <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">Resets Monthly</span>
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">Approve and update employee salaries for the current cycle.</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {wages.map((emp) => (
                      <div key={emp.id} className={`p-4 rounded-xl border transition-colors flex items-center justify-between ${emp.sanctioned ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950/50 border-slate-800'}`}>
                        <div className="flex items-center gap-4">
                          <FormControlLabel
                            control={
                              <Checkbox 
                                checked={emp.sanctioned} 
                                onChange={() => handleWagesToggle(emp.id)}
                                sx={{ color: '#475569', '&.Mui-checked': { color: '#10b981' } }}
                              />
                            }
                            label=""
                            className="!m-0"
                          />
                          <div>
                            <div className="text-white font-semibold">{emp.name} <span className="text-slate-500 text-xs ml-2 font-mono">{emp.id}</span></div>
                            <div className="text-slate-400 text-sm">{emp.role}</div>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-emerald-400">{emp.amount}</div>
                      </div>
                    ))}
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="contained" className="!bg-emerald-500 hover:!bg-emerald-600 !text-slate-900 !font-bold !py-3 !px-6 !rounded-xl w-full flex justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Execute Monthly Sanction Batch
                    </Button>
                  </motion.div>
                </Paper>
              </motion.div>
            )}

            {/* --- 2. OPERATIONS FINANCE SECTION --- */}
            {activeMainTab === 1 && (
              <motion.div key="ops-finance" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                <Paper className="!bg-slate-900/80 !border !border-slate-800 !p-8 !rounded-2xl !shadow-2xl">
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">Project-Wise Ledgers</h2>
                      <p className="text-sm text-slate-400 mt-1">Manage external payments handed over by Operations and Sales[cite: 1].</p>
                    </div>
                    
                    {/* Sub-tabs for Vendors vs Buyers */}
                    <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-1">
                      <button 
                        onClick={() => setActiveFinanceTab(0)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${activeFinanceTab === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        <Building2 className="w-4 h-4" /> Vendor Payments
                      </button>
                      <button 
                        onClick={() => setActiveFinanceTab(1)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${activeFinanceTab === 1 ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        <CircleDollarSign className="w-4 h-4" /> Buyer Settlements
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Table based on Sub-tab */}
                  <TableContainer component={Box} className="!bg-slate-950/50 !rounded-xl !border !border-slate-800">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell className="!text-slate-400 !border-b-slate-800">Project ID</TableCell>
                          <TableCell className="!text-slate-400 !border-b-slate-800">{activeFinanceTab === 0 ? 'Vendor' : 'Buyer'} Name</TableCell>
                          <TableCell className="!text-slate-400 !border-b-slate-800">Item / Material</TableCell>
                          <TableCell className="!text-slate-400 !border-b-slate-800">Amount</TableCell>
                          <TableCell className="!text-slate-400 !border-b-slate-800">Status</TableCell>
                          <TableCell className="!text-slate-400 !border-b-slate-800 align-right">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(activeFinanceTab === 0 ? mockVendors : mockBuyers).map((row, idx) => (
                          <TableRow key={idx} className="hover:bg-slate-900/50 transition-colors">
                            <TableCell className="!text-white !font-mono !text-xs !border-b-slate-800/50">{row.project}</TableCell>
                            <TableCell className="!text-white !font-medium !border-b-slate-800/50">{activeFinanceTab === 0 ? row.vendor : row.buyer}</TableCell>
                            <TableCell className="!text-slate-300 !border-b-slate-800/50">{row.item}</TableCell>
                            <TableCell className="!text-emerald-400 !font-bold !border-b-slate-800/50">{row.amount}</TableCell>
                            <TableCell className="!border-b-slate-800/50">
                              <Chip 
                                label={row.status} 
                                size="small" 
                                className={`!font-medium ${row.status === 'Paid' || row.status === 'Settled' ? '!bg-emerald-500/10 !text-emerald-400 !border !border-emerald-500/20' : '!bg-amber-500/10 !text-amber-400 !border !border-amber-500/20'}`} 
                              />
                            </TableCell>
                            <TableCell className="!border-b-slate-800/50">
                              <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors">
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                </Paper>
              </motion.div>
            )}

          </AnimatePresence>
        </Box>
      </div>
    </div>
  );
}