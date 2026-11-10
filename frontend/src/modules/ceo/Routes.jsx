import { Routes, Route, Navigate } from "react-router-dom";
import CEODashboard from "./pages/CEODashboard";


export default function CEORoutes() {
  return (
    <Routes>
      <Route path="/ceo-dashboard" element={<CEODashboard />} />
    </Routes>
  );
}