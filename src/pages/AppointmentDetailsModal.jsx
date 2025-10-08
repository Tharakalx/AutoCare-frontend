// components/AppointmentDetailsModal.jsx
import { useState } from 'react';
import { FaTimes, FaEdit, FaCalendarAlt, FaClock, FaCar, FaUserCog, FaTools } from 'react-icons/fa';

export default function AppointmentDetailsModal({ appointment, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState('details');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { class: "bg-green-100 text-green-800", label: "Confirmed" },
      pending: { class: "bg-yellow-100 text-yellow-800", label: "Pending" },
      cancelled: { class: "bg-red-100 text-red-800", label: "Cancelled" },
      completed: { class: "bg-blue-100 text-blue-800", label: "Completed" },
      'in-progress': { class: "bg-orange-100 text-orange-800", label: "In Progress" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const tabs = [
    { id: 'details', label: 'Appointment Details', icon: FaCalendarAlt },
    { id: 'service', label: 'Service Information', icon: FaTools },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {appointment.serviceType}
            </h2>
            <p className="text-gray-600">{formatDate(appointment.date)} at {appointment.time}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Appointment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Appointment Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <FaCalendarAlt className="text-indigo-500" />
                        Date
                      </span>
                      <span className="font-medium">{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <FaClock className="text-indigo-500" />
                        Time
                      </span>
                      <span className="font-medium">{appointment.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Type</span>
                      <span className="font-medium">{appointment.serviceType}</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle & Mechanic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Service Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <FaCar className="text-indigo-500" />
                        Vehicle
                      </span>
                      <span className="font-medium">{appointment.vehicleName}</span>
                      <span className="text-gray-600">Estimated Duration</span>
                      <span className="font-medium">1-2 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {appointment.notes && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{appointment.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'service' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Service Details</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">What to Expect:</h4>
                  <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
                    <li>Professional service by certified mechanic</li>
                    <li>Quality parts and materials</li>
                    <li>Comprehensive inspection</li>
                    <li>Detailed service report</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Service Checklist:</h4>
                  <div className="space-y-2">
                    {appointment.serviceType === 'Oil Change' && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Drain and replace engine oil</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Replace oil filter</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Inspect fluid levels</span>
                        </div>
                      </>
                    )}
                    {appointment.serviceType === 'Brake Inspection' && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Inspect brake pads and rotors</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Check brake fluid levels</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Test brake performance</span>
                        </div>
                      </>
                    )}
                    {/* Add more service type checklists as needed */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Appointment created on {formatDate(appointment.createdAt || new Date())}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
              {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                <button
                  onClick={() => onEdit(appointment)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <FaEdit />
                  Edit Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}