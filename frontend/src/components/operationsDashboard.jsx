import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, Tab, Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, Paper } from '@mui/material';
import { ShoppingCart, LayoutGrid, ShieldCheck, UploadCloud, Plus } from 'lucide-react';

// Animation variants for tab transitions
const tabVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

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

export default function OperationsDashboard() {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <div className="min-h-screen bg-[#08090d] text-slate-100 p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8 border-b border-slate-800 pb-6">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <LayoutGrid className="text-amber-500 w-8 h-8" />
                        Operations Control Panel
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        Manage vendor purchases, resource allocations, and metallurgical QC reports.
                    </p>
                </div>

                {/* Custom MUI Tabs with Framer Motion UI feel */}
                <Paper elevation={0} className="!bg-slate-900/50 !border !border-slate-800 !rounded-xl overflow-hidden mb-8">
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        TabIndicatorProps={{ style: { backgroundColor: '#f59e0b', height: '3px' } }}
                        sx={{ '& .MuiTab-root': { color: '#94a3b8', textTransform: 'none', fontSize: '1rem' }, '& .Mui-selected': { color: '#f59e0b !important', fontWeight: 'bold' } }}
                    >
                        <Tab icon={<ShoppingCart className="w-5 h-5 mb-1" />} label="Purchase Dept" />
                        <Tab icon={<LayoutGrid className="w-5 h-5 mb-1" />} label="Allocation Dept" />
                        <Tab icon={<ShieldCheck className="w-5 h-5 mb-1" />} label="Quality Control" />
                    </Tabs>
                </Paper>

                {/* Animated Tab Content */}
                <Box className="relative min-h-[400px]">
                    <AnimatePresence mode="wait">

                        {/* --- 1. PURCHASE DEPARTMENT --- */}
                        {activeTab === 0 && (
                            <motion.div key="purchase" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                                <Paper className="!bg-slate-900/80 !border !border-slate-800 !p-8 !rounded-2xl !shadow-2xl">
                                    <h2 className="text-xl font-bold text-white mb-6">Issue New Purchase</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormControl fullWidth className="!bg-slate-950/50 !rounded-lg">
                                            <InputLabel className="!text-slate-400">Purchase Type</InputLabel>
                                            <Select label="Purchase Type" defaultValue="independent" className="!text-white">
                                                <MenuItem value="independent">Independent Purchase</MenuItem>
                                                <MenuItem value="project">Project-Based Purchase</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <TextField fullWidth label="Vendor Name" variant="outlined" sx={textFieldSx} InputLabelProps={{ className: '!text-slate-400' }} InputProps={{ className: '!text-white !bg-slate-950/50' }} />
                                        <TextField fullWidth label="Materials (e.g., Titanium Billets)" variant="outlined" sx={textFieldSx} InputLabelProps={{ className: '!text-slate-400' }} InputProps={{ className: '!text-white !bg-slate-950/50' }} />
                                        <TextField fullWidth label="Purchase Details & Specs" multiline rows={1} variant="outlined" sx={textFieldSx} InputLabelProps={{ className: '!text-slate-400' }} InputProps={{ className: '!text-white !bg-slate-950/50' }} />
                                    </div>
                                    <motion.div
                                        className="inline-block mt-6"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            variant="contained"
                                            className="!bg-amber-500 hover:!bg-amber-600 !text-slate-900 !font-bold !py-3 !px-6 !rounded-xl !flex !gap-2"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Issue to Finance Dept
                                        </Button>
                                    </motion.div>
                                </Paper>
                            </motion.div>
                        )}

                        {/* --- 2. ALLOCATION DEPARTMENT --- */}
                        {activeTab === 1 && (
                            <motion.div key="allocation" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                                <Paper className="!bg-slate-900/80 !border !border-slate-800 !p-8 !rounded-2xl !shadow-2xl">
                                    <h2 className="text-xl font-bold text-white mb-6">Allocate Bought Resources</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormControl fullWidth className="!bg-slate-950/50 !rounded-lg">
                                            <InputLabel className="!text-slate-400">Target Project ID</InputLabel>
                                            <Select label="Target Project ID" defaultValue="PRJ-GOV-884" className="!text-white">
                                                <MenuItem value="PRJ-GOV-884">PRJ-GOV-884 (Gov)</MenuItem>
                                                <MenuItem value="PRJ-MKT-201">PRJ-MKT-201 (Market)</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <TextField fullWidth label="Material Pool (e.g., Carbon Steel)" variant="outlined" sx={textFieldSx} InputLabelProps={{ className: '!text-slate-400' }} InputProps={{ className: '!text-white !bg-slate-950/50' }} />
                                        <TextField fullWidth label="Quantity to Allocate" type="number" variant="outlined" sx={textFieldSx} InputLabelProps={{ className: '!text-slate-400' }} InputProps={{ className: '!text-white !bg-slate-950/50' }} />
                                    </div>
                                    <motion.div
                                        className="inline-block mt-6"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            variant="contained"
                                            className="!bg-emerald-500 hover:!bg-emerald-600 !text-slate-900 !font-bold !py-3 !px-6 !rounded-xl flex gap-2"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Fulfill Requirement
                                        </Button>
                                    </motion.div>
                                </Paper>
                            </motion.div>
                        )}

                        {/* --- 3. QUALITY CONTROL --- */}
                        {activeTab === 2 && (
                            <motion.div key="qc" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full">
                                <Paper className="!bg-slate-900/80 !border !border-slate-800 !p-8 !rounded-2xl !shadow-2xl">
                                    <h2 className="text-xl font-bold text-white mb-6">Upload QC Reports</h2>
                                    <div className="grid grid-cols-1 gap-6">
                                        <FormControl fullWidth className="!bg-slate-950/50 !rounded-lg">
                                            <InputLabel className="!text-slate-400">Link to Project</InputLabel>
                                            <Select label="Link to Project" defaultValue="PRJ-MKT-201" className="!text-white">
                                                <MenuItem value="PRJ-GOV-884">PRJ-GOV-884</MenuItem>
                                                <MenuItem value="PRJ-MKT-201">PRJ-MKT-201</MenuItem>
                                            </Select>
                                        </FormControl>

                                        {/* Mock File Dropzone */}
                                        <div className="border-2 border-dashed border-slate-700 hover:border-amber-500 transition-colors rounded-xl p-10 flex flex-col items-center justify-center bg-slate-950/30 cursor-pointer">
                                            <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
                                            <p className="text-slate-300 font-medium">Drag & drop PDF certificates here</p>
                                            <p className="text-xs text-slate-500 mt-1">Will generate pre-signed URL for Cloudflare R2 storage</p>
                                        </div>
                                    </div>
                                    <motion.div
                                        className="inline-block mt-6"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            variant="contained"
                                            className="!bg-cyan-500 hover:!bg-cyan-600 !text-slate-900 !font-bold !py-3 !px-6 !rounded-xl flex gap-2"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Fulfill Requirement
                                        </Button>
                                    </motion.div>
                                </Paper>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </Box>
            </div>
        </div>
    );
}