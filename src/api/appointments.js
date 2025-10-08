
import apiClient from './client';

export const appointmentsAPI = {
  // Get all appointments for the current user
  getMyAppointments: async () => {
    try {
      const response = await apiClient.get('/booking/api/v1/bookings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add a new appointment
  addAppointment: async (appointmentData) => {
    try {
      const response = await apiClient.post('/booking/api/v1/bookings', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update an appointment
  updateAppointment: async (appointmentId, appointmentData) => {
    try {
      const response = await apiClient.put(`/booking/api/v1/bookings/${appointmentId}`, appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete an appointment
  deleteAppointment: async (appointmentId) => {
    try {
      const response = await apiClient.delete(`/booking/api/v1/bookings/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  

  
};