import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

import DepartmentSelection from "./pages/DepartmentSelection";
import SalesRoutes from "./modules/sales/Routes.jsx";
import OperationsRoutes from "./modules/operations/Routes.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DepartmentSelection />} />
      <Route path="/sales/*" element={<SalesRoutes />} />
      <Route path="/operations/*" element={<OperationsRoutes />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default App;