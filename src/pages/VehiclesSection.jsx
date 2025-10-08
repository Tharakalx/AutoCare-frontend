import { useState, useEffect } from 'react';
import { FaCar, FaPlus, FaEdit, FaTrash, FaTools } from "react-icons/fa";
import { vehiclesAPI } from '../api/vehicles';
import AddVehicleModal from './AddVehicleModal';
import VehicleDetailsModal from './VehicleDetailsModal';

export default function VehiclesSection() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehiclesAPI.getMyVehicles();
      setVehicles(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch vehicles');
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (vehicleData) => {
    try {
      const newVehicle = await vehiclesAPI.addVehicle(vehicleData);
      setVehicles(prev => [...prev, newVehicle]);
      setShowAddModal(false);
      setError('');
    } catch (err) {
      setError('Failed to add vehicle');
      console.error('Error adding vehicle:', err);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      await vehiclesAPI.deleteVehicle(vehicleId);
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
      setError('');
    } catch (err) {
      setError('Failed to delete vehicle');
      console.error('Error deleting vehicle:', err);
    }
  };

  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
            <p className="text-gray-600 mt-2">Manage your registered vehicles and service schedules</p>
          </div>
        </div>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
          <p className="text-gray-600 mt-2">Manage your registered vehicles and service schedules</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <FaPlus /> Add Vehicle
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <FaCar className="text-gray-400 text-8xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles added yet</h3>
          <p className="text-gray-500 mb-6">Add your first vehicle to get started with our services</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{vehicle.brand} {vehicle.model}</h3>
                  <p className="text-gray-600">{vehicle.year} • {vehicle.licence_plate}</p>
                  <p className="text-sm text-gray-500 mt-1">type: {vehicle.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  vehicle.status === 'active' ? 'bg-green-100 text-green-800' : 
                  vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {vehicle.status}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Service:</span>
                  <span className="text-gray-900">
                    {vehicle.lastServiceDate ? new Date(vehicle.lastServiceDate).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Next Service Due:</span>
                  <span className="text-orange-600 font-medium">
                    {vehicle.nextServiceDate ? new Date(vehicle.nextServiceDate).toLocaleDateString() : 'Not scheduled'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mileage:</span>
                  <span className="text-gray-900">{vehicle.currentMileage?.toLocaleString() || '0'} miles</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewDetails(vehicle)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm flex items-center justify-center gap-2"
                >
                  <FaTools /> Details
                </button>
                <button 
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition text-sm flex items-center justify-center gap-2"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <AddVehicleModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddVehicle}
        />
      )}

      {/* Vehicle Details Modal */}
      {showDetailsModal && selectedVehicle && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}