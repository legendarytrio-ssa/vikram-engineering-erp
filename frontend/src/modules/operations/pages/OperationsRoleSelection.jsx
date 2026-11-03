import { Link } from "react-router-dom";

export default function OperationsRoleSelection() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Operations Department</h1>
        <p className="text-slate-500 mt-2 text-lg">Select your sub-department workspace</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Link to="/operations/qc" className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-xl p-8 shadow-sm hover:shadow-md transition text-center group">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🏗️</div>
          <h2 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition">Quality Control</h2>
          <p className="text-slate-500 mt-3">Site management, BOQ parsing, and material verification.</p>
        </Link>

        <Link to="/operations/purchase" className="bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-xl p-8 shadow-sm hover:shadow-md transition text-center group">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🛒</div>
          <h2 className="text-2xl font-bold text-slate-800 group-hover:text-emerald-600 transition">Purchase & Procurement</h2>
          <p className="text-slate-500 mt-3">Budget tracking, PO generation, and vendor management.</p>
        </Link>
      </div>
      
      <Link to="/" className="mt-12 text-slate-400 hover:text-slate-600 font-medium">← Back to Main ERP Login</Link>
    </div>
  );
}