import axios from "axios";

const API = axios.create({
  baseURL: "https://task-manager-app-production-8089.up.railway.app/api",
});

export default API;