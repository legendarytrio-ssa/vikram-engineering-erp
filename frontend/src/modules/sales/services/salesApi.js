import axios from "axios";

const salesApi = axios.create({
  baseURL: "http://localhost:3000/api/sales",
});

export default salesApi;