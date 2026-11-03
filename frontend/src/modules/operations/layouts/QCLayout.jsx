import { Link } from "react-router-dom";

export default function QCLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 bg-slate-950 font-bold border-b border-slate-700">Operations | QC</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/operations/qc" className="block px-4 py-2 rounded bg-slate-800">Active Projects</Link>
          <div className="block px-4 py-2 rounded text-slate-400 cursor-not-allowed">Site Logs</div>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link to="/operations" className="text-sm text-slate-400 hover:text-white">← Switch Department</Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-4 font-semibold text-slate-600 flex justify-between items-center">
          <span>Quality Control Workspace</span>
          <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">QC Active</span>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}