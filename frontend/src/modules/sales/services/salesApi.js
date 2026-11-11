import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const salesApi = axios.create({
  baseURL: `${API_BASE_URL}/api/sales`,
});

export default salesApi;