// src/api/client.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5050",
   withCredentials: true, // Gateway service URL
});

// Add JWT token to every request if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // assuming you stored token in localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
