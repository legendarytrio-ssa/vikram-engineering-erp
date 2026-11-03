import { Link } from "react-router-dom";
import { liveProjects } from "../../data/dummyData";

export default function PurchaseDashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Purchase: Active Projects</h1>
      <div className="grid gap-4">
        {liveProjects.map((project) => (
          <div key={project.projectId} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-emerald-900">{project.projectName} ({project.projectId})</h2>
              {project.boqLocked 
                ? <span className="inline-block mt-2 text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Budget Active</span>
                : <span className="inline-block mt-2 text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">🔒 Locked (Waiting on QC)</span>
              }
            </div>
            <Link 
              to={`/operations/purchase/projects/${project.projectId}`}
              className={`${project.boqLocked ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-300 pointer-events-none'} text-white px-4 py-2 rounded font-medium`}
            >
              Open Tracker
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}