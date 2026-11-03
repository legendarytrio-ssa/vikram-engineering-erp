import { useState } from "react";
import { useParams } from "react-router-dom";
import { liveProjects } from "../data/dummyData";
import QCTab from "../components/QCTab";
import PurchaseTab from "../components/PurchaseTab";

export default function LiveProjectPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("QC");
  const project = liveProjects.find((p) => p.id === id);

  if (!project) return <div>Project not found.</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow border border-slate-200 min-h-[80vh]">
      {/* Project Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50 rounded-t-lg">
        <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
        <p className="text-slate-500 font-medium">ID: {project.id} | Client: {project.client}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 px-4">
        <button 
          onClick={() => setActiveTab("QC")}
          className={`px-6 py-3 font-semibold ${activeTab === "QC" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
        >
          QC Vault & BOQ
        </button>
        <button 
          onClick={() => setActiveTab("PURCHASE")}
          className={`px-6 py-3 font-semibold ${activeTab === "PURCHASE" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
        >
          Purchase & Budget
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "QC" && <QCTab project={project} />}
        {activeTab === "PURCHASE" && <PurchaseTab project={project} />}
      </div>
    </div>
  );
}