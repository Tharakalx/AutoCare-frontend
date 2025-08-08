import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiInfo, FiCalendar, FiDollarSign, FiTool, FiAlertTriangle } from 'react-icons/fi';

const VehiclePage = () => {
  // Service schedule configuration (mileage intervals in km)
  const serviceSchedule = [
    { id: 1, name: 'Oil Change', interval: 10000, description: 'Engine oil and filter replacement' },
    { id: 2, name: 'Tire Rotation', interval: 15000, description: 'Tire rotation and pressure check' },
    { id: 3, name: 'Brake Inspection', interval: 20000, description: 'Complete brake system inspection' },
    { id: 4, name: 'Air Filter Replacement', interval: 30000, description: 'Engine air filter replacement' },
    { id: 5, name: 'Transmission Fluid', interval: 60000, description: 'Transmission fluid change' },
    { id: 6, name: 'Coolant Flush', interval: 80000, description: 'Cooling system flush and refill' },
  ];

  // Form state
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    fuelType: 'petrol',
    color: '#3b82f6',
    mileage: '',
    regNo: '',
    lastServiceMileage: '',
    lastServiceDate: ''
  });

  // App state
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [serviceHistory, setServiceHistory] = useState([]);
  const [upcomingServices, setUpcomingServices] = useState([]);

  // Mock service history data
  const mockServiceHistory = [
    {
      id: 1,
      date: '2023-05-15',
      serviceType: 'Oil Change',
      description: 'Full synthetic oil change and filter replacement',
      cost: 89.99,
      mileage: 15000,
      workshop: 'Quick Lube Center'
    },
    {
      id: 2,
      date: '2023-08-22',
      serviceType: 'Tire Rotation',
      description: 'Tire rotation and pressure check',
      cost: 29.99,
      mileage: 18500,
      workshop: 'Tire Masters'
    }
  ];

  // Calculate upcoming services based on mileage
  const calculateUpcomingServices = (vehicle) => {
    if (!vehicle || !vehicle.mileage) return [];
    
    const currentMileage = parseInt(vehicle.mileage) || 0;
    const lastServiceMileage = parseInt(vehicle.lastServiceMileage) || 0;
    
    return serviceSchedule
      .map(service => {
        const lastServiceCount = Math.floor(lastServiceMileage / service.interval);
        const nextServiceAt = (lastServiceCount + 1) * service.interval;
        const dueIn = nextServiceAt - currentMileage;
        
        return {
          ...service,
          nextServiceAt,
          dueIn,
          status: dueIn <= 0 ? 'Overdue' : 
                 dueIn <= 1000 ? 'Due Soon' : 'Upcoming'
        };
      })
      .filter(service => service.dueIn <= 5000) // Only show services due within 5000 km
      .sort((a, b) => a.dueIn - b.dueIn); // Sort by most urgent first
  };

  // Load/save data
  useEffect(() => {
    const saved = localStorage.getItem('vehicles');
    if (saved) {
      const parsedVehicles = JSON.parse(saved);
      setVehicles(parsedVehicles);
      
      // If viewing a vehicle, calculate its upcoming services
      if (selectedVehicle) {
        const vehicleToView = parsedVehicles.find(v => v.regNo === selectedVehicle.regNo);
        if (vehicleToView) {
          setUpcomingServices(calculateUpcomingServices(vehicleToView));
        }
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  // Update upcoming services when viewing a vehicle
  useEffect(() => {
    if (viewMode && selectedVehicle) {
      setUpcomingServices(calculateUpcomingServices(selectedVehicle));
    }
  }, [viewMode, selectedVehicle]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      const updatedVehicles = vehicles.map(v => v.regNo === selectedVehicle.regNo ? formData : v);
      setVehicles(updatedVehicles);
      
      // Update upcoming services if we're viewing this vehicle
      if (viewMode && formData.regNo === selectedVehicle.regNo) {
        setSelectedVehicle(formData);
        setUpcomingServices(calculateUpcomingServices(formData));
      }
    } else {
      if (vehicles.some(v => v.regNo === formData.regNo)) {
        alert('This registration number already exists!');
        return;
      }
      setVehicles([...vehicles, formData]);
    }
    
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: '',
      fuelType: 'petrol',
      color: '#3b82f6',
      mileage: '',
      regNo: '',
      lastServiceMileage: '',
      lastServiceDate: ''
    });
    setIsEditing(false);
    setSelectedVehicle(null);
  };

  // Vehicle actions
  const editVehicle = (vehicle) => {
    setFormData(vehicle);
    setSelectedVehicle(vehicle);
    setIsEditing(true);
    setActiveTab('form');
  };

  const deleteVehicle = (regNo) => {
    if (window.confirm('Delete this vehicle?')) {
      setVehicles(vehicles.filter(v => v.regNo !== regNo));
      if (selectedVehicle?.regNo === regNo) {
        resetForm();
        setViewMode(false);
      }
    }
  };

  const viewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setServiceHistory(mockServiceHistory);
    setUpcomingServices(calculateUpcomingServices(vehicle));
    setViewMode(true);
  };

  // Color options
  const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#10b981' },
    { name: 'Black', value: '#1f2937' },
    { name: 'White', value: '#f3f4f6' },
    { name: 'Silver', value: '#9ca3af' },
  ];

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Due Soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Vehicle Manager</h1>
          <p className="text-gray-600">Manage your vehicle inventory and service history</p>
        </header>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 font-medium ${activeTab === 'list' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Vehicle List
          </button>
          <button
            onClick={() => {
              setActiveTab('form');
              resetForm();
            }}
            className={`px-4 py-2 font-medium ${activeTab === 'form' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {isEditing ? 'Edit Vehicle' : 'Add Vehicle'}
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Form View */}
          {activeTab === 'form' && (
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Make */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                    <input
                      type="text"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Registration Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration No *</label>
                    <input
                      type="text"
                      name="regNo"
                      value={formData.regNo}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isEditing ? 'bg-gray-100' : ''}`}
                      required
                      disabled={isEditing}
                    />
                  </div>

                  {/* Current Mileage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Mileage (km) *</label>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type *</label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="lpg">LPG</option>
                    </select>
                  </div>

                  {/* Last Service Mileage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Service Mileage (km)</label>
                    <input
                      type="number"
                      name="lastServiceMileage"
                      value={formData.lastServiceMileage}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Last Service Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Service Date</label>
                    <input
                      type="date"
                      name="lastServiceDate"
                      value={formData.lastServiceDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Color Picker */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <div key={color.value} className="flex items-center">
                          <input
                            type="radio"
                            name="color"
                            id={`color-${color.value}`}
                            value={color.value}
                            checked={formData.color === color.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <label
                            htmlFor={`color-${color.value}`}
                            className={`w-8 h-8 rounded-full cursor-pointer border-2 ${formData.color === color.value ? 'border-blue-500' : 'border-transparent'}`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List View */}
          {activeTab === 'list' && (
            <div className="p-6">
              {vehicles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <FiPlus className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No vehicles yet</h3>
                  <p className="mt-1 text-gray-500">Add your first vehicle to get started</p>
                  <button
                    onClick={() => setActiveTab('form')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Add Vehicle
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {vehicles.length} {vehicles.length === 1 ? 'Vehicle' : 'Vehicles'}
                    </h3>
                    <button
                      onClick={() => setActiveTab('form')}
                      className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      <FiPlus className="mr-1.5" /> Add New
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehicles.map((vehicle) => {
                      const vehicleUpcomingServices = calculateUpcomingServices(vehicle);
                      const hasUrgentServices = vehicleUpcomingServices.some(s => s.status === 'Overdue' || s.status === 'Due Soon');
                      
                      return (
                        <div
                          key={vehicle.regNo}
                          className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow ${hasUrgentServices ? 'border-l-4 border-l-red-500' : ''}`}
                        >
                          <div
                            className="h-3"
                            style={{ backgroundColor: vehicle.color }}
                          />
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {vehicle.make} {vehicle.model}
                                </h4>
                                <p className="text-sm text-gray-500">{vehicle.year}</p>
                              </div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {vehicle.regNo}
                              </span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-gray-500">Fuel</p>
                                <p className="font-medium capitalize">{vehicle.fuelType}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Mileage</p>
                                <p className="font-medium">{vehicle.mileage} km</p>
                              </div>
                            </div>

                            {/* Upcoming services alert */}
                            {hasUrgentServices && (
                              <div className="mt-3 p-2 bg-red-50 rounded-md">
                                <div className="flex items-center text-red-700">
                                  <FiAlertTriangle className="mr-1.5 flex-shrink-0" />
                                  <span className="text-xs font-medium">
                                    {vehicleUpcomingServices.filter(s => s.status === 'Overdue').length} overdue, {' '}
                                    {vehicleUpcomingServices.filter(s => s.status === 'Due Soon').length} due soon
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="mt-4 flex space-x-2">
                              <button
                                onClick={() => viewVehicle(vehicle)}
                                className="flex-1 flex items-center justify-center py-1.5 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <FiInfo className="mr-1.5" /> Details
                              </button>
                              <button
                                onClick={() => editVehicle(vehicle)}
                                className="flex-1 flex items-center justify-center py-1.5 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <FiEdit2 className="mr-1.5" /> Edit
                              </button>
                              <button
                                onClick={() => deleteVehicle(vehicle.regNo)}
                                className="flex-1 flex items-center justify-center py-1.5 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600"
                              >
                                <FiTrash2 className="mr-1.5" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Details Modal with Service History */}
      {viewMode && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Vehicle Details</h2>
                <button
                  onClick={() => setViewMode(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Vehicle Info Section */}
                <div className="flex items-center space-x-4">
                  <div
                    className="w-16 h-16 rounded-lg"
                    style={{ backgroundColor: selectedVehicle.color }}
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedVehicle.make} {selectedVehicle.model}
                    </h3>
                    <p className="text-gray-600">{selectedVehicle.year}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Registration No</p>
                    <p className="font-medium">{selectedVehicle.regNo}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-medium capitalize">{selectedVehicle.fuelType}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Current Mileage</p>
                    <p className="font-medium">{selectedVehicle.mileage} km</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Last Service Mileage</p>
                    <p className="font-medium">{selectedVehicle.lastServiceMileage || 'N/A'} km</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Last Service Date</p>
                    <p className="font-medium">
                      {selectedVehicle.lastServiceDate || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-medium capitalize">
                      {colors.find(c => c.value === selectedVehicle.color)?.name.toLowerCase()}
                    </p>
                  </div>
                </div>

                {/* Upcoming Services Section */}
                {upcomingServices.length > 0 && (
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FiAlertTriangle className="mr-2 text-yellow-500" /> Upcoming Services
                    </h3>
                    <div className="space-y-3">
                      {upcomingServices.map((service) => (
                        <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{service.name}</h4>
                              <p className="text-sm text-gray-500">{service.description}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                              {service.status === 'Overdue' ? 'Overdue' : 
                               service.status === 'Due Soon' ? 'Due Soon' : 
                               `Due in ${service.dueIn} km`}
                            </span>
                          </div>
                          <div className="mt-2 text-sm">
                            <p className="text-gray-500">
                              <span className="font-medium">Next due:</span> {service.nextServiceAt} km
                              {service.dueIn <= 0 ? (
                                <span className="ml-2 text-red-600">({Math.abs(service.dueIn)} km overdue)</span>
                              ) : (
                                <span className="ml-2">(in {service.dueIn} km)</span>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service History Section */}
                <div className="pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <FiTool className="mr-2" /> Service History
                  </h3>
                  
                  {serviceHistory.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No service records found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {serviceHistory.map((service) => (
                        <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{service.serviceType}</h4>
                              <p className="text-sm text-gray-500">{service.description}</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ${service.cost.toFixed(2)}
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center text-gray-500">
                              <FiCalendar className="mr-1.5" /> {service.date}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <FiDollarSign className="mr-1.5" /> {service.workshop}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <span className="mr-1.5">Mileage:</span> {service.mileage} km
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex space-x-3">
                  <button
                    onClick={() => {
                      setViewMode(false);
                      editVehicle(selectedVehicle);
                    }}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Edit Vehicle
                  </button>
                  <button
                    onClick={() => {
                      alert('In a real app, this would open a form to add new service record');
                    }}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                  >
                    Add Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclePage;