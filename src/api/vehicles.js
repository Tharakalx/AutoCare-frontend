// api/vehicles.js
import apiClient from './client';

export const vehiclesAPI = {
  // Get all vehicles for the current user
  getMyVehicles: async () => {
    try {
      const response = await apiClient.get('/vehicle/api/v1/getvehicles');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

        //   // Get a specific vehicle by ID
        //   getVehicleById: async (vehicleId) => {
        //     try {
        //       const response = await apiClient.('/vehicle/api/v1/vehicle');
        //       return response.data;
        //     } catch (error) {
        //       throw error.response?.data || error.message;
        //     }
        //   },

  // Add a new vehicle
  addVehicle: async (vehicleData) => {
    try {
      const response = await apiClient.post('/vehicle/api/v1/addvehicle', vehicleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a vehicle
  updateVehicle: async (vehicleId, vehicleData) => {
    try {
      const response = await apiClient.put(`/vehicle/api/v1/vehicle/${vehicleId}`, vehicleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a vehicle
  deleteVehicle: async (vehicleId) => {
    try {
      const response = await apiClient.delete(`/vehicle/api/v1/vehicle/${vehicleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get vehicle service history
  getVehicleServiceHistory: async (vehicleId) => {
    try {
      const response = await apiClient.get(`/vehicles/${vehicleId}/service-history`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Schedule next service
  scheduleNextService: async (vehicleId, serviceData) => {
    try {
      const response = await apiClient.post(`/vehicles/${vehicleId}/schedule-service`, serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};