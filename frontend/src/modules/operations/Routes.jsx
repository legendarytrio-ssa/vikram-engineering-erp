import { Routes, Route, Navigate } from "react-router-dom";

import OperationsRoleSelection from "./pages/OperationsRoleSelection";
import QCRoutes from "./pages/qc/QCRoutes";
import PurchaseRoutes from "./pages/purchase/PurchaseRoutes";

export default function OperationsRoutes() {
  return (
    <Routes>
      <Route index element={<OperationsRoleSelection />} />

      <Route path="qc/*" element={<QCRoutes />} />

      <Route path="purchase/*" element={<PurchaseRoutes />} />

      <Route path="*" element={<Navigate to="/operations" replace />} />
    </Routes>
  );
}