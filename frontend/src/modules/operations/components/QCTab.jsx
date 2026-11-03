import { useState } from "react";
import { sampleParsedBOQ } from "../data/dummyData";

export default function QCTab({ project }) {
  const [file, setFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [isLocked, setIsLocked] = useState(project.boqLocked);

  const handleUpload = () => {
    setIsParsing(true);
    setTimeout(() => { setParsedData(sampleParsedBOQ); setIsParsing(false); }, 1500);
  };

  const handleApproveAndLock = () => {
    setIsLocked(true);
    project.boqLocked = true;
    alert("Budget Locked! Purchase Department can now begin procurement.");
  };

  if (isLocked) return <div className="bg-emerald-50 text-emerald-800 p-6 rounded-lg font-medium">✅ Final BOQ verified and locked. Procurement is active.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Final BOQ Upload</h2>
      {!parsedData && (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 text-center bg-slate-50">
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="mb-4 text-slate-500" />
          <button onClick={handleUpload} disabled={!file || isParsing} className="bg-blue-600 text-white px-6 py-2 rounded font-medium disabled:opacity-50">
            {isParsing ? "Parsing PDF..." : "Extract Data"}
          </button>
        </div>
      )}

      {parsedData && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-amber-50 border-b border-amber-200">
            <h3 className="font-bold text-amber-800">⚠️ Verify before locking budget</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-sm border-b">
                <th className="p-3">Item Code</th><th className="p-3">Material</th><th className="p-3">Qty</th><th className="p-3">UOM</th><th className="p-3">Rate</th>
              </tr>
            </thead>
            <tbody>
              {parsedData.map((row, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-3 font-mono text-sm">{row.itemCode}</td>
                  <td className="p-3 font-medium">{row.materialName}</td>
                  <td className="p-3"><input type="number" defaultValue={row.allocatedQty} className="border p-1 w-24 text-center" /></td>
                  <td className="p-3">{row.uom}</td>
                  <td className="p-3 font-mono">₹{row.unitRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 flex justify-end gap-4 bg-slate-50">
            <button onClick={() => setParsedData(null)} className="text-slate-600 px-4 py-2 hover:bg-slate-200 rounded">Cancel</button>
            <button onClick={handleApproveAndLock} className="bg-emerald-600 text-white font-bold px-6 py-2 rounded">Approve & Lock Budget</button>
          </div>
        </div>
      )}
    </div>
  );
}