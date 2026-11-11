
import { Routes, Route, Navigate } from "react-router-dom";

import PurchaseHub from "./PurchaseHub";
import ProjectPurchaseDashboard from "./ProjectPurchaseDashboard";
import EditPurchaseOrder from "./EditPurchaseOrder";


// Keep your existing imports and routes as well.

export default function PurchaseRoutes() {
  return (
    <Routes>
      <Route index element={<PurchaseHub />} />

      <Route
        path="projects/:projectId/purchase-orders/new"
        element={<ProjectPurchaseDashboard />}
      />

      <Route
        path="projects/:projectId/purchase-orders/:poId/edit"
        element={<EditPurchaseOrder />}
      />

      {/* Keep your other existing routes here */}

      <Route path="*" element={<Navigate to="/operations/purchase" replace />} />
    </Routes>
  );
}

//Extra