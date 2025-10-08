// components/AppointmentsSection.jsx
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaClock, FaCar } from "react-icons/fa";
import { appointmentsAPI } from '../api/appointments';
import AddAppointmentModal from './AddAppointmentModal';
import AppointmentDetailsModal from './AppointmentDetailsModal';

export default function AppointmentsSection({ appointments: initialAppointments, onAppointmentsUpdate }) {
  const [appointments, setAppointments] = useState(initialAppointments || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsAPI.getMyAppointments();
      setAppointments(data);
      setError('');
      onAppointmentsUpdate?.(data);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
      // Use initial appointments if API fails
      if (initialAppointments) {
        setAppointments(initialAppointments);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async (appointmentData) => {
    try {
      const newAppointment = await appointmentsAPI.addAppointment(appointmentData);
      const updatedAppointments = [...appointments, newAppointment];
      setAppointments(updatedAppointments);
      onAppointmentsUpdate?.(updatedAppointments);
      setShowAddModal(false);
      setError('');
    } catch (err) {
      setError('Failed to add appointment');
      console.error('Error adding appointment:', err);
      throw err; // Re-throw to handle in modal
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentsAPI.deleteAppointment(appointmentId);
      const updatedAppointments = appointments.filter(appointment => appointment.bookingId !== appointmentId);
      setAppointments(updatedAppointments);
      onAppointmentsUpdate?.(updatedAppointments);
      setError('');
    } catch (err) {
      setError('Failed to cancel appointment');
      console.error('Error deleting appointment:', err);
    }
  };

  const handleViewDetails = async (appointment) => {
    try {
      // Fetch full appointment details by ID
      const fullAppointment = await appointmentsAPI.getAppointmentById(appointment.bookingId);
      setSelectedAppointment(fullAppointment);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error fetching appointment details:', err);
      // Fallback to basic appointment data
      setSelectedAppointment(appointment);
      setShowDetailsModal(true);
    }
  };

  const handleEditAppointment = async (appointment) => {
    // For editing, you might want to create a separate EditAppointmentModal
    // For now, we'll just show the details
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      CONFIRMED: { class: "bg-green-100 text-green-800", label: "Confirmed" },
      PENDING: { class: "bg-yellow-100 text-yellow-800", label: "Pending" },
      CANCELLED: { class: "bg-red-100 text-red-800", label: "Cancelled" },
      COMPLETED: { class: "bg-blue-100 text-blue-800", label: "Completed" }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600 mt-2">Manage your service appointments and bookings</p>
          </div>
        </div>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-2">Manage your service appointments and bookings</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <FaPlus /> Book Appointment
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <FaCalendarAlt className="text-gray-400 text-8xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments scheduled</h3>
          <p className="text-gray-500 mb-6">Book your first service appointment to get started</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Book Your First Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div key={appointment.bookingId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="font-bold text-xl text-gray-900">{appointment.serviceType}</h3>
                    {getStatusBadge(appointment.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendarAlt className="text-indigo-500" />
                      <span>{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaClock className="text-indigo-500" />
                      <span>{appointment.time}</span>
                    </div>
                   
                  </div>

                  {appointment.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 text-sm">
                        <strong>Notes:</strong> {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewDetails(appointment)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm flex items-center justify-center gap-2"
                >
                  <FaCalendarAlt /> Details
                </button>
                {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
                  <button 
                    onClick={() => handleEditAppointment(appointment)}
                    className="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition text-sm flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Reschedule
                  </button>
                )}
                {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
                  <button 
                    onClick={() => handleDeleteAppointment(appointment.bookingId)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition text-sm flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Appointment Modal */}
      {showAddModal && (
        <AddAppointmentModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddAppointment}
        />
      )}

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setShowDetailsModal(false)}
          onEdit={handleEditAppointment}
        />
      )}
    </div>
  );
}