import { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaTools, FaCalendarAlt, FaHistory } from 'react-icons/fa';
import { vehiclesAPI } from '../api/vehicles';

export default function VehicleDetailsModal({ vehicle, onClose }) {
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchServiceHistory();
  }, [vehicle]);

  const fetchServiceHistory = async () => {
    try {
      const history = await vehiclesAPI.getVehicleServiceHistory(vehicle.id);
      setServiceHistory(history);
    } catch (error) {
      console.error('Error fetching service history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const tabs = [
    { id: 'details', label: 'Vehicle Details', icon: FaTools },
    { id: 'history', label: 'Service History', icon: FaHistory },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </h2>
            <p className="text-gray-600">License Plate: {vehicle.licensePlate}</p>
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
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Make & Model</span>
                      <span className="font-medium">{vehicle.make} {vehicle.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year</span>
                      <span className="font-medium">{vehicle.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">License Plate</span>
                      <span className="font-medium">{vehicle.licensePlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">VIN</span>
                      <span className="font-medium">{vehicle.vin || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Color</span>
                      <span className="font-medium">{vehicle.color || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Service Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Mileage</span>
                      <span className="font-medium">
                        {vehicle.currentMileage ? `${vehicle.currentMileage.toLocaleString()} miles` : 'Not recorded'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Service</span>
                      <span className="font-medium">
                        {vehicle.lastServiceDate ? formatDate(vehicle.lastServiceDate) : 'Never serviced'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Service Due</span>
                      <span className={`font-medium ${
                        vehicle.nextServiceDate && new Date(vehicle.nextServiceDate) < new Date() 
                          ? 'text-red-600' 
                          : 'text-orange-600'
                      }`}>
                        {vehicle.nextServiceDate ? formatDate(vehicle.nextServiceDate) : 'Not scheduled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status?.charAt(0).toUpperCase() + vehicle.status?.slice(1) || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maintenance Notes */}
              {vehicle.notes && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Maintenance Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{vehicle.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Service History</h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading service history...</p>
                </div>
              ) : serviceHistory.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FaHistory className="text-gray-400 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500">No service history found for this vehicle</p>
                  <p className="text-sm text-gray-400 mt-1">Service records will appear here after maintenance</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {serviceHistory.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{service.serviceType}</h4>
                          <p className="text-gray-600 text-sm">{formatDate(service.date)}</p>
                          <p className="text-gray-500 text-sm">Mechanic: {service.mechanicName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-indigo-600">{formatCurrency(service.cost)}</p>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            service.status === 'completed' ? 'bg-green-100 text-green-800' :
                            service.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {service.status}
                          </span>
                        </div>
                      </div>
                      
                      {service.notes && (
                        <div className="bg-gray-50 rounded p-3 mt-2">
                          <p className="text-sm text-gray-700"><strong>Notes:</strong> {service.notes}</p>
                        </div>
                      )}
                      
                      {service.partsReplaced && service.partsReplaced.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Parts Replaced:</p>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {service.partsReplaced.map((part, index) => (
                              <li key={index}>{part}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Vehicle added on {formatDate(vehicle.createdAt || new Date())}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Navigate to book service page or open booking modal
                  console.log('Book service for:', vehicle.id);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <FaCalendarAlt />
                Book Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}