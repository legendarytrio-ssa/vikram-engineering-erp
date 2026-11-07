import { Routes, Route, Navigate } from "react-router-dom";
import QCDashboard from "./QCDashboard";

export default function QCRoutes() {
  return (
    <Routes>
      <Route index element={<QCDashboard />} />

      <Route path="*" element={<Navigate to="/operations/qc" replace />} />
    </Routes>
  );
}