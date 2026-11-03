// Dummy data matching the MongoDB 'Project' Schema
export const liveProjects = [
  {
    projectId: "PROJ-001",
    projectName: "5km Highway Bridge",
    clientName: "NHAI",
    deadline: "2027-12-01",
    status: "LIVE",
    boqLocked: false,            // The critical trigger flag
    totalEstimatedBudget: 0,     // Populates after BOQ is locked
    totalActualSpent: 0          // Accumulates as POs are paid
  },
  {
    projectId: "PROJ-002",
    projectName: "City Center Mall Foundation",
    clientName: "DLF Properties",
    deadline: "2028-03-15",
    status: "LIVE",
    boqLocked: true,             // Already locked and in procurement phase
    totalEstimatedBudget: 45000000, 
    totalActualSpent: 12500000
  }
];

// Dummy data matching the exact JSON output from the Camelot PDF extraction
// and the static fields of your MongoDB 'BoqItem' Schema
export const sampleParsedBOQ = [
  {
    itemCode: "CIV-EXC-01",
    materialName: "Earthwork in excavation for foundation trenches",
    uom: "Cu.M",
    allocatedQty: 1200,
    unitRate: 350,
    estimatedCost: 420000
  },
  {
    itemCode: "CIV-CON-01",
    materialName: "Plain Cement Concrete (PCC 1:4:8) for foundation base",
    uom: "Cu.M",
    allocatedQty: 450,
    unitRate: 4500,
    estimatedCost: 2025000
  },
  {
    itemCode: "STL-TMT-500D",
    materialName: "High-Yield TMT Steel Bars (Grade 500D) cut and bent",
    uom: "Tons",
    allocatedQty: 120,
    unitRate: 65000,
    estimatedCost: 7800000
  },
  {
    itemCode: "CEM-PPC-43",
    materialName: "Portland Pozzolana Cement (PPC) Grade 43 (50kg bags)",
    uom: "Bags",
    allocatedQty: 5000,
    unitRate: 380,
    estimatedCost: 1900000
  },
  {
    itemCode: "MAT-SND-01",
    materialName: "Coarse River Sand for concreting",
    uom: "Cu.M",
    allocatedQty: 800,
    unitRate: 1200,
    estimatedCost: 960000
  }
];