import { Routes, Route, Navigate } from "react-router-dom";
import OperationsRoleSelection from "./pages/OperationsRoleSelection";
import PurchaseRoutes from "./pages/purchase/PurchaseRoutes";
// import QCRoutes from "../pages/qc/QCRoutes"; 

export default function OperationsRoutes() {
  return (
    <Routes>
      <Route index element={<OperationsRoleSelection />} />
      <Route path="purchase/*" element={<PurchaseRoutes />} />
      {/* <Route path="qc/*" element={<QCRoutes />} /> */}
      <Route path="*" element={<Navigate to="/operations" replace />} />
    </Routes>
  );
}