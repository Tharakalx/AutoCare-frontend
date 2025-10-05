import { useEffect, useState } from "react";
import apiClient from "../api/client";
import { jwtDecode } from "jwt-decode";
import {
  FaUserCircle,
  FaEdit,
  FaSave,
  FaCar,
  FaCalendarAlt,
  FaHistory,
  FaCog,
  FaBell,

  FaPlus,
  FaTools,
} from "react-icons/fa";
import { FaShield } from "react-icons/fa6"; // or from fa6

import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaSignOutAlt } from "react-icons/fa";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("profile");
  const [vehicles, setVehicles] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch profile and related data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      navigate("/signin");
      return;
    }

    fetchUserData(token);
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      // Fetch profile
      const profileRes = await apiClient.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(profileRes.data);

      // Fetch vehicles (mock data for now - replace with your API)
      const mockVehicles = [
        {
          id: 1,
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          licensePlate: 'ABC123',
          lastServiceDate: '2024-01-15',
          status: 'active'
        },
        {
          id: 2,
          make: 'Honda',
          model: 'Civic',
          year: 2019,
          licensePlate: 'XYZ789',
          lastServiceDate: '2024-02-20',
          status: 'active'
        }
      ];
      setVehicles(mockVehicles);

      // Fetch appointments (mock data for now - replace with your API)
      const mockAppointments = [
        {
          id: 1,
          serviceType: 'Oil Change',
          date: '2024-03-20',
          time: '10:00 AM',
          vehicleName: 'Toyota Camry',
          mechanicName: 'Mike Johnson',
          status: 'confirmed'
        },
        {
          id: 2,
          serviceType: 'Brake Inspection',
          date: '2024-03-25',
          time: '2:00 PM',
          vehicleName: 'Honda Civic',
          mechanicName: 'Sarah Wilson',
          status: 'pending'
        }
      ];
      setAppointments(mockAppointments);

      // Fetch service history (mock data for now - replace with your API)
      const mockServiceHistory = [
        {
          id: 1,
          serviceType: 'Full Service',
          date: '2024-01-15',
          vehicleName: 'Toyota Camry',
          cost: 120,
          mechanicName: 'Mike Johnson',
          notes: 'Regular maintenance completed'
        },
        {
          id: 2,
          serviceType: 'Tire Rotation',
          date: '2024-02-20',
          vehicleName: 'Honda Civic',
          cost: 45,
          mechanicName: 'Sarah Wilson',
          notes: 'Tires rotated and balanced'
        }
      ];
      setServiceHistory(mockServiceHistory);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/signin");

    // Optional: Show logout message
    // You can add a toast notification here if you have one
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setSaving(true);
    setMessage("");

    try {
      const res = await apiClient.put(
        "/auth/profile",
        {
          fullName: profile.fullName,
          email: profile.email,
          contactNo: profile.contactNo,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("❌ Error updating profile");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // Navigation items
  const navItems = [
    { id: "profile", label: "Profile", icon: FaUserCircle },
    { id: "vehicles", label: "My Vehicles", icon: FaCar },
    { id: "appointments", label: "My Appointments", icon: FaCalendarAlt },
    { id: "history", label: "Service History", icon: FaHistory },
    { id: "settings", label: "Settings", icon: FaCog },
    { id: "logout", label: "Logout", icon: FaSignOutAlt },
  ];

  // Render different sections
  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSection();
      case "vehicles":
        return renderVehiclesSection();
      case "appointments":
        return renderAppointmentsSection();
      case "history":
        return renderServiceHistorySection();
      case "settings":
        return renderSettingsSection();
      default:
        return renderProfileSection();
    }
  };

  const renderProfileSection = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Information</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and account settings</p>
        </div>

        {/* Edit/Save Button */}
        <button
          onClick={editing ? handleSave : () => setEditing(true)}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${editing
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
        >
          {editing ? (
            <>
              <FaSave /> {saving ? "Saving..." : "Save Changes"}
            </>
          ) : (
            <>
              <FaEdit /> Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="relative inline-block">
              <FaUserCircle className="text-indigo-600 text-8xl mx-auto" />
              <button className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition">
                <FaEdit size={14} />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">
              {profile?.fullName || "Unknown User"}
            </h2>
            <p className="text-gray-500">@{profile?.username}</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Active Member
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-lg text-gray-800 bg-gray-50 rounded-lg p-3">
                    {profile.fullName || "-"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-lg text-gray-800 bg-gray-50 rounded-lg p-3">
                    {profile.email || "-"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Contact Number</label>
                {editing ? (
                  <input
                    type="text"
                    name="contactNo"
                    value={profile.contactNo || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-lg text-gray-800 bg-gray-50 rounded-lg p-3">
                    {profile.contactNo || "-"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Member Since</label>
                <p className="text-lg text-gray-800 bg-gray-50 rounded-lg p-3">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-lg text-center ${message.includes("successfully")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
                }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderVehiclesSection = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
          <p className="text-gray-600 mt-2">Manage your registered vehicles and service schedules</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
          <FaPlus /> Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <FaCar className="text-gray-400 text-8xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles added yet</h3>
          <p className="text-gray-500 mb-6">Add your first vehicle to get started with our services</p>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
            Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{vehicle.make} {vehicle.model}</h3>
                  <p className="text-gray-600">{vehicle.year} • {vehicle.licensePlate}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${vehicle.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {vehicle.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Service:</span>
                  <span className="text-gray-900">{vehicle.lastServiceDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Next Service Due:</span>
                  <span className="text-orange-600 font-medium">In 30 days</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm">
                  View Details
                </button>
                <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm">
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAppointmentsSection = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-2">View and manage your service appointments</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
          <FaPlus /> Book Appointment
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <FaCalendarAlt className="text-gray-400 text-8xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments scheduled</h3>
          <p className="text-gray-500 mb-6">Book your first service appointment</p>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
            Book Your First Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{appointment.serviceType}</h3>
                  <p className="text-gray-600 text-lg">{appointment.date} at {appointment.time}</p>
                  <p className="text-gray-500 mt-1">Vehicle: {appointment.vehicleName}</p>
                  <p className="text-gray-500">Mechanic: {appointment.mechanicName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                  {appointment.status}
                </span>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition">
                  Reschedule
                </button>
                <button className="flex-1 bg-red-100 text-red-700 px-4 py-3 rounded-lg hover:bg-red-200 transition">
                  Cancel Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderServiceHistorySection = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service History</h1>
          <p className="text-gray-600 mt-2">Complete record of all your vehicle services</p>
        </div>
      </div>

      {serviceHistory.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <FaHistory className="text-gray-400 text-8xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No service history found</h3>
          <p className="text-gray-500">Your service history will appear here after your first service</p>
        </div>
      ) : (
        <div className="space-y-6">
          {serviceHistory.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{service.serviceType}</h3>
                  <p className="text-gray-600 text-lg">{service.date}</p>
                  <p className="text-gray-500 mt-1">Vehicle: {service.vehicleName}</p>
                  <p className="text-gray-500">Mechanic: {service.mechanicName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">${service.cost}</p>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Completed
                  </span>
                </div>
              </div>
              {service.notes && (
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-gray-700"><strong>Notes:</strong> {service.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettingsSection = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your preferences and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaBell className="text-indigo-600 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900">Notification Preferences</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <input type="checkbox" className="h-5 w-5 text-indigo-600 rounded" defaultChecked />
            </label>

            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive text message alerts</p>
              </div>
              <input type="checkbox" className="h-5 w-5 text-indigo-600 rounded" defaultChecked />
            </label>

            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Appointment Reminders</p>
                <p className="text-sm text-gray-500">Get reminded before appointments</p>
              </div>
              <input type="checkbox" className="h-5 w-5 text-indigo-600 rounded" />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaShield className="text-indigo-600 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900">Security</h3>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left">
              <div>
                <p className="font-medium text-gray-900">Change Password</p>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
              <FaEdit className="text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <FaEdit className="text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition text-left">
              <div>
                <p className="font-medium text-red-900">Delete Account</p>
                <p className="text-sm text-red-500">Permanently delete your account</p>
              </div>
              <FaEdit className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500 text-xl">Loading your profile...</div>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500 text-xl">No profile found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="font-bold text-xl text-gray-900 mb-6">Dashboard</h3>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === "logout") {
                          handleLogout();
                        } else {
                          setActiveSection(item.id);
                        }
                      }}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeSection === item.id && item.id !== "logout"
                        ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100"
                        : item.id === "logout"
                          ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      <Icon className="text-lg" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content - Full Width */}
          <div className="flex-1 min-w-0">
            <div className="bg-transparent">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}