import { Routes, Route } from "react-router-dom";
import PurchaseLayout from "../../layouts/PurchaseLayout.jsx";
import PurchaseDashboard from "./PurchaseDashboard.jsx";
import PurchaseProjectVault from "./PurchaseProjectVault.jsx";

export default function PurchaseRoutes() {
  return (
    <PurchaseLayout>
      <Routes>
        <Route path="/" element={<PurchaseDashboard />} />
        <Route path="/projects/:id" element={<PurchaseProjectVault />} />
      </Routes>
    </PurchaseLayout>
  );
}