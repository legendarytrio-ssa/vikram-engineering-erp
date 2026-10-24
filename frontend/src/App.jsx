
import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";

import DepartmentSelection from "./pages/DepartmentSelection";
import SalesRoutes from "./modules/sales/routes";
//comment added for test
function App() {
  return (
    <Routes>
      {/* Main ERP Landing */}
      <Route path="/" element={<DepartmentSelection />} />

      {/* Sales Department */}
      <Route path="/sales/*" element={<SalesRoutes />} />

      {/* Invalid routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
