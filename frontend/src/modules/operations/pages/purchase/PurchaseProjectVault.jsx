import { useParams } from "react-router-dom";
import { liveProjects, sampleParsedBOQ } from "../../data/dummyData";

export default function PurchaseProjectVault() {
  const { id } = useParams();
  const project = liveProjects.find((p) => p.projectId === id);

  if (!project) return <div>Project not found.</div>;

  if (!project.boqLocked) {
    return (
      <div className="text-center p-12 bg-white rounded-lg border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">🔒 Procurement Locked</h2>
        <p className="text-slate-500">Waiting on QC team to verify and lock the Final BOQ.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow border border-slate-200">
      <div className="p-6 border-b border-slate-200 bg-slate-50 rounded-t-lg flex justify-between">
        <h1 className="text-2xl font-bold">{project.projectName}</h1>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded font-medium">+ Issue PO</button>
      </div>
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Budget vs. Actual Tracker</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-sm border-b">
              <th className="p-3">Material</th><th className="p-3">Allocated Budget</th><th className="p-3">Purchased (Actual)</th><th className="p-3">Progress</th>
            </tr>
          </thead>
          <tbody>
            {sampleParsedBOQ.map((row, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-3 font-medium">{row.materialName}</td>
                <td className="p-3 text-sm">{row.allocatedQty} {row.uom} <br/><span className="text-xs text-slate-500">₹{row.estimatedCost}</span></td>
                <td className="p-3 text-sm font-medium text-blue-600">0 {row.uom} <br/><span className="text-xs text-slate-500">₹0 spent</span></td>
                <td className="p-3 w-48"><div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-emerald-500 h-2.5 rounded-full w-0"></div></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}