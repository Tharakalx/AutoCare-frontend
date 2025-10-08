// components/AddAppointmentModal.jsx
import { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaCar } from 'react-icons/fa';
import { appointmentsAPI } from '../api/appointments';
import { vehiclesAPI } from '../api/vehicles';

export default function AddAppointmentModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    serviceType: '',
    vehicleId: '',
    date: '',
    time: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');

  const serviceTypes = [
    'Oil Change',
    'Brake Inspection',
    'Tire Rotation',
    'Full Service',
    'Engine Diagnostic',
    'AC Service',
    'Battery Replacement',
    'Transmission Service',
    'Wheel Alignment',
    'Electrical System Check'
  ];

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await vehiclesAPI.getMyVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Failed to load vehicles');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Prepare data for backend - match your BookingDto structure
      const bookingData = {
        serviceType: formData.serviceType,
        vehicleId: parseInt(formData.vehicleId),
        date: formData.date,
        time: formData.time,
        notes: formData.notes || '' // Optional field
      };

      await onSave(bookingData);
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
      console.error('Error submitting appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const minDate = new Date().toISOString().split('T')[0];

  // Generate time slots (9 AM to 5 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Book New Appointment</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaCalendarAlt className="text-indigo-500" />
              Service Type *
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Service Type</option>
              {serviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaCar className="text-indigo-500" />
                Vehicle *
              </label>
              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} ({vehicle.licence_plate})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={minDate}
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Time</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any specific requirements, concerns, or additional information..."
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}