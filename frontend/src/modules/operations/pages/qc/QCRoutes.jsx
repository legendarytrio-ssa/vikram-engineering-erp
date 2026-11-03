import { Routes, Route } from "react-router-dom";
import QCLayout from "../../layouts/QCLayout";
import QCDashboard from "./QCDashboard";
import QCProjectVault from "./QCProjectVault";

export default function QCRoutes() {
  return (
    <QCLayout>
      <Routes>
        <Route path="/" element={<QCDashboard />} />
        <Route path="/projects/:id" element={<QCProjectVault />} />
      </Routes>
    </QCLayout>
  );
}