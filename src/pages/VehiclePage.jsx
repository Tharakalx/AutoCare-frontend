import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiInfo, FiCalendar, FiDollarSign, FiTool, FiAlertTriangle, FiUser, FiSave } from 'react-icons/fi';

const CustomerDashboard = () => {
  // Service schedule configuration
  const serviceSchedule = [
    { id: 1, name: 'Oil Change', interval: 5000, description: 'Engine oil and filter replacement' },
    { id: 2, name: 'Tire Rotation', interval: 10000, description: 'Tire rotation and pressure check' },
    { id: 3, name: 'Brake Inspection', interval: 15000, description: 'Complete brake system inspection' },
  ];

  // Customer profile state
  const [profile, setProfile] = useState({
    name: 'John Doe',
    nic: '123456789V',
    phone: '+94771234567',
    email: 'john.doe@example.com'
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Vehicle management state
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    fuelType: 'petrol',
    color: '#3b82f6',
    mileage: '0',
    regNo: '',
    lastServiceMileage: '0',
    lastServiceDate: ''
  });

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('vehicles');
  const [serviceHistory, setServiceHistory] = useState([]);
  const [upcomingServices, setUpcomingServices] = useState([]);

  // Load initial data (will be replaced with database calls)
  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockVehicles = [
      {
        make: 'Toyota',
        model: 'Corolla',
        year: '2020',
        fuelType: 'petrol',
        color: '#3b82f6',
        mileage: '15000',
        regNo: 'CAB-1234',
        lastServiceMileage: '10000',
        lastServiceDate: '2023-06-15'
      }
    ];
    
    setVehicles(mockVehicles);
    setServiceHistory([
      {
        id: 1,
        date: '2023-06-15',
        serviceType: 'Oil Change',
        description: 'Full synthetic oil change',
        cost: 89.99,
        mileage: 10000,
        workshop: 'Quick Lube Center'
      }
    ]);
  }, []);

  // Calculate upcoming services
  const calculateUpcomingServices = (vehicle) => {
    if (!vehicle?.mileage) return [];
    
    const currentMileage = Number(vehicle.mileage);
    const lastServiceMileage = Number(vehicle.lastServiceMileage) || 0;
    
    return serviceSchedule.map(service => {
      const lastDoneAt = Math.floor(lastServiceMileage / service.interval) * service.interval;
      const nextServiceAt = lastDoneAt + service.interval;
      const dueIn = nextServiceAt - currentMileage;
      
      return {
        ...service,
        lastDoneAt,
        nextServiceAt,
        dueIn,
        status: dueIn <= 0 ? 'Overdue' : dueIn <= 1000 ? 'Due Soon' : 'Upcoming'
      };
    }).filter(s => s.dueIn <= 10000).sort((a, b) => a.dueIn - b.dueIn);
  };

  // Profile handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    // In a real app, this would call your backend API
    try {
      // await api.updateProfile(profile);
      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
      console.error('Profile update error:', error);
    }
  };

  // Vehicle handlers
  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveVehicle = async () => {
    const vehicleData = {
      ...formData,
      mileage: formData.mileage || '0',
      lastServiceMileage: formData.lastServiceMileage || '0'
    };

    try {
      if (isEditingVehicle) {
        // await api.updateVehicle(vehicleData);
        setVehicles(vehicles.map(v => v.regNo === selectedVehicle.regNo ? vehicleData : v));
      } else {
        // await api.addVehicle(vehicleData);
        setVehicles([...vehicles, vehicleData]);
      }
      resetVehicleForm();
    } catch (error) {
      alert('Failed to save vehicle');
      console.error('Vehicle save error:', error);
    }
  };

  const resetVehicleForm = () => {
    setFormData({
      make: '',
      model: '',
      year: '',
      fuelType: 'petrol',
      color: '#3b82f6',
      mileage: '0',
      regNo: '',
      lastServiceMileage: '0',
      lastServiceDate: ''
    });
    setIsEditingVehicle(false);
    setSelectedVehicle(null);
  };

  const deleteVehicle = async (regNo) => {
    if (window.confirm('Delete this vehicle?')) {
      try {
        // await api.deleteVehicle(regNo);
        setVehicles(vehicles.filter(v => v.regNo !== regNo));
        if (selectedVehicle?.regNo === regNo) {
          resetVehicleForm();
          setViewMode(false);
        }
      } catch (error) {
        alert('Failed to delete vehicle');
        console.error('Vehicle delete error:', error);
      }
    }
  };

  const viewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
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

  // Status color helper
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
          <h1 className="text-3xl font-bold text-gray-800">Customer Dashboard</h1>
          <p className="text-gray-600">Manage your profile and vehicles</p>
        </header>

        {/* Main Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiUser className="inline mr-2" /> My Profile
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-4 py-2 font-medium ${activeTab === 'vehicles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiTool className="inline mr-2" /> My Vehicles
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  <FiEdit2 className="mr-1.5" /> Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="px-3 py-1.5 border border-gray-300 text-sm rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    <FiSave className="mr-1.5" /> Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2 text-gray-900">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number</label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="nic"
                    value={profile.nic}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2 text-gray-900">{profile.nic}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                {isEditingProfile ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2 text-gray-900">{profile.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                {isEditingProfile ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="px-4 py-2 text-gray-900">{profile.email}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Vehicle List View */}
            {!isEditingVehicle && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">My Vehicles</h2>
                  <button
                    onClick={() => {
                      setActiveTab('vehicles');
                      resetVehicleForm();
                      setIsEditingVehicle(true);
                    }}
                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    <FiPlus className="mr-1.5" /> Add Vehicle
                  </button>
                </div>

                {vehicles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <FiPlus className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No vehicles yet</h3>
                    <p className="mt-1 text-gray-500">Add your first vehicle to get started</p>
                    <button
                      onClick={() => setIsEditingVehicle(true)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                      Add Vehicle
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
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
                                  onClick={() => {
                                    setFormData(vehicle);
                                    setSelectedVehicle(vehicle);
                                    setIsEditingVehicle(true);
                                  }}
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

            {/* Vehicle Form View */}
            {isEditingVehicle && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {isEditingVehicle && selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={resetVehicleForm}
                      className="px-3 py-1.5 border border-gray-300 text-sm rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveVehicle}
                      className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      <FiSave className="mr-1.5" /> Save Vehicle
                    </button>
                  </div>
                </div>

                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Make */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                      <input
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={handleVehicleChange}
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
                        onChange={handleVehicleChange}
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
                        onChange={handleVehicleChange}
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
                        onChange={handleVehicleChange}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isEditingVehicle && selectedVehicle ? 'bg-gray-100' : ''}`}
                        required
                        disabled={isEditingVehicle && selectedVehicle}
                      />
                    </div>

                    {/* Current Mileage */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Mileage (km) *</label>
                      <input
                        type="number"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleVehicleChange}
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
                        onChange={handleVehicleChange}
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
                        onChange={handleVehicleChange}
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
                        onChange={handleVehicleChange}
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
                              onChange={handleVehicleChange}
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
                </form>
              </div>
            )}
          </div>
        )}

        {/* Vehicle Details Modal */}
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
                                <span className="font-medium">Service Interval:</span> Every {service.interval} km
                              </p>
                              <p className="text-gray-500">
                                <span className="font-medium">Last Done At:</span> {service.lastDoneAt || 0} km
                              </p>
                              <p className="text-gray-500">
                                <span className="font-medium">Next Due At:</span> {service.nextServiceAt} km
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
                        setFormData(selectedVehicle);
                        setIsEditingVehicle(true);
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
    </div>
  );
};

export default CustomerDashboard;