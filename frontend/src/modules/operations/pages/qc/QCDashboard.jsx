import { Link } from "react-router-dom";
import { liveProjects } from "../../data/dummyData";

export default function QCDashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">QC: Active Projects</h1>
      <div className="grid gap-4">
        {liveProjects.map((project) => (
          <div key={project.projectId} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-blue-900">{project.projectName} ({project.projectId})</h2>
              <p className="text-sm text-slate-500">Client: {project.clientName}</p>
              {project.boqLocked 
                ? <span className="inline-block mt-2 text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">BOQ Locked</span>
                : <span className="inline-block mt-2 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">Pending BOQ Upload</span>
              }
            </div>
            <Link to={`/operations/qc/projects/${project.projectId}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium">
              Open QC Vault
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}