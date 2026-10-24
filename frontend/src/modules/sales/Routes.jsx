import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AddTenderPage from "./pages/AddTenderPage";
import AllClientsForm from "./pages/AllClientsForm";

export default function SalesRoutes() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="tenders/new" element={<AddTenderPage />} />
      <Route path="clients/new" element={<AllClientsForm />} />
    </Routes>
  );
}