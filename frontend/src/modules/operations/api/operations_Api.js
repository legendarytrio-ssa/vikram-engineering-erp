import axios from "axios";

// Using environment variable for production readiness (Vercel), falling back to localhost
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const operationsApi = axios.create({
  baseURL: `${API_BASE_URL}/api/operations`,
});

// Optional: Add interceptors here later if you need to attach JWT tokens to Operations requests
// operationsApi.interceptors.request.use((config) => { ... })

export default operationsApi;