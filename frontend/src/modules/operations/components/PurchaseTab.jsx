export default function PurchaseTab({ project }) {
  if (!project.boqLocked) {
    return (
      <div className="text-center p-10 bg-slate-50 rounded border border-slate-200">
        <h2 className="text-xl font-bold text-slate-400">🔒 Procurement Locked</h2>
        <p className="text-slate-500 mt-2">The Purchase Department cannot issue POs until the QC team verifies and locks the Final BOQ.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">Budget Tracker & Purchase Orders</h2>
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-blue-900 font-medium">
        BOQ Budget is active. You are authorized to generate Vendor POs.
      </div>
    </div>
  );  
}