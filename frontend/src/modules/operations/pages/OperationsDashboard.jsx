import { Link } from "react-router-dom";
import { liveProjects } from "../data/dummyData";

export default function OperationsDashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Active Live Projects</h1>
      <div className="grid gap-4">
        {liveProjects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-blue-900">{project.name} ({project.id})</h2>
              <p className="text-sm text-slate-500">Client: {project.client} | Deadline: {project.deadline}</p>
            </div>
            <Link 
              to={`/operations/projects/${project.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition"
            >
              Open Workspace
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}