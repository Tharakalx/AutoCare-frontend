import apiClient from "./client";

// Register user
export const registerUser = (data) => apiClient.post("/auth/register", data);

export const login = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);

  // Save JWT token
  localStorage.setItem("token", response.data.token);

  return response.data;
};
export const logout = () => {
  localStorage.removeItem("token");
};
export const getVehicles = () => apiClient.get("/service1/api/v1/vehicle");