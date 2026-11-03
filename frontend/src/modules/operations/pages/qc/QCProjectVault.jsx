import { useParams } from "react-router-dom";
import { liveProjects } from "../../data/dummyData";
import QCTab from "../../components/QCTab";

export default function QCProjectVault() {
  const { id } = useParams();
  const project = liveProjects.find((p) => p.projectId === id);

  if (!project) return <div>Project not found.</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow border border-slate-200">
      <div className="p-6 border-b border-slate-200 bg-slate-50 rounded-t-lg">
        <h1 className="text-2xl font-bold">{project.projectName}</h1>
      </div>
      <div className="p-6"><QCTab project={project} /></div>
    </div>
  );
}