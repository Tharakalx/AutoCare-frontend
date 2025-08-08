import { useState, useEffect } from 'react';

export default function Appointments() {
  const services = [
    {
      name: "Under Wash",
      description: "Clean your vehicle’s undercarriage to remove dirt and prevent corrosion.",
      price: 5000,
      image: "https://picsum.photos/800/600",
    },
    {
      name: "Body Wash",
      description: "Keep your vehicle sparkling clean with our thorough exterior body wash.",
      price: 3000,
      image: "https://content.jdmagicbox.com/comp/coimbatore/r9/0422px422.x422.170513180827.x5r9/catalogue/car-body-wash-service-ganapathy-coimbatore-car-washing-services-4gqrigo.jpeg",
    },
    {
      name: "Body Wax",
      description: "Protect and shine your vehicle’s paint with our premium body wax service.",
      price: 8000,
      image: "https://picsum.photos/800/600",
    },
    {
      name: "Cut and Polish",
      description: "Restore your vehicle’s shine by removing scratches and enhancing gloss.",
      price: 15000,
      image: "https://picsum.photos/800/600",
    },
    {
      name: "Interior Cleaning",
      description: "Refresh your vehicle’s interior with our deep cleaning and detailing service.",
      price: 10000,
      image: "https://picsum.photos/800/600",
    },
    {
      name: "Engine Degreasing",
      description: "Clean and protect your engine with our thorough degreasing service.",
      price: 6000,
      image: "https://picsum.photos/800/600",
    },
    {
      name: "Oil Change",
      description: "Keep your engine running smoothly with our premium oil change service.",
      price: 15000,
      image: "https://www.steelehyundaikyle.com/assets/shared/CustomHTMLFiles/Compliance/Hyundai/images/oil-change-header.jpg",
    },
    {
      name: "Brake Service",
      description: "Ensure safety with our comprehensive brake inspection and repair.",
      price: 39000,
      image: "https://cdn-ilddian.nitrocdn.com/cclTClxkiLnkxweuDsJamWEuJYamkxqL/assets/images/optimized/rev-97ef586/hcsrepair.com/wp-content/uploads/2024/09/HCS-Auto-Repair-Brake-Repair-2-Springdale-Rogers-Arkansas-1024x683.png",
    },
    {
      name: "Tire Service",
      description: "Tire rotation, balancing, and replacement for optimal performance.",
      price: 27000,
      image: "https://picsum.photos/800/600",
    },
    {
      name: "Engine Diagnostics",
      description: "Advanced diagnostics to identify and fix engine issues.",
      price: 30000,
      image: "https://just-automotive.net/Files/Images/Blog/AdobeStock_341429200%20(Small).jpeg",
    },
    {
      name: "Air Conditioning Repair",
      description: "Stay cool with our A/C system recharge and repair.",
      price: 24000,
      image: "https://aaa.scene7.com/is/image/aaaautoclubsouthstage/2-Car-AC-GettyImages-1182824484-1?ts=1736700036720&dpr=off",
    },
    {
      name: "Transmission Service",
      description: "Maintain smooth gear shifts with our transmission care.",
      price: 45000,
      image: "https://picsum.photos/800/600",
    },
    {
      name: "Battery Service",
      description: "Battery testing and replacement for reliable starts.",
      price: 21000,
      image: "https://media.infopay.net/thumbnails/Bs5vHtQgRNpxhbz0tQHNPbynolEozoXqT0WJdVTO.webp",
    },
    {
      name: "Wheel Alignment",
      description: "Improve handling and tire life with precise alignment.",
      price: 18000,
      image: "https://www.popularmaruti.com/blog/wp-content/uploads/2022/08/wheels.jpg",
    },
    {
      name: "Engine Tune-Up",
      description: "Optimize your vehicle's performance with our comprehensive engine tune-up service.",
      price: 24000,
      image: "https://omegaautocare.com/wp-content/uploads/2023/02/car-tune-up-basics.jpg",
    },
  ];

  const comboPackages = [
    {
      name: "Essential Maintenance Package",
      services: ["Oil Change", "Tire Service", "Battery Service"],
      price: 48000,
      originalPrice: 63000,
      image: "https://picsum.photos/800/600",
    },
    {
      name: "Complete Care Package",
      services: ["Oil Change", "Brake Service", "Wheel Alignment", "Air Conditioning Repair", "Body Wash"],
      price: 84000,
      originalPrice: 96000,
      image: "https://picsum.photos/800/600",
    },
    {
      name: "Premium Performance Package",
      services: ["Engine Diagnostics", "Transmission Service", "Wheel Alignment"],
      price: 81000,
      originalPrice: 93000,
      image: "https://picsum.photos/800/600",
    },
  ];

  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  ];

  const getAvailableTimeSlots = (date) => {
    const bookedSlots = appointments
      .filter((appt) => appt.date === date)
      .reduce((acc, appt) => {
        acc[appt.time] = (acc[appt.time] || 0) + 1;
        return acc;
      }, {});
    const available = timeSlots.filter((slot) => (bookedSlots[slot] || 0) < 3);
    return available.length ? available : ['No slots available'];
  };

  const totalPrice = selectedCombo
    ? comboPackages.find((pkg) => pkg.name === selectedCombo)?.price || 0
    : selectedServices.reduce((sum, serviceName) => {
        const service = services.find((s) => s.name === serviceName);
        return sum + (service ? service.price : 0);
      }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!selectedDate) {
      setErrorMessage('Please select a date.');
      return;
    }
    if (!selectedTime || selectedTime === 'No slots available') {
      setErrorMessage('Please select a valid time slot.');
      return;
    }
    if (selectedServices.length === 0 && !selectedCombo) {
      setErrorMessage('Please select at least one service or a combo package.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newAppointment = {
        id: editingId || Date.now(),
        date: selectedDate,
        time: selectedTime,
        services: selectedCombo
          ? comboPackages.find((pkg) => pkg.name === selectedCombo).services
          : selectedServices,
        description,
        totalPrice,
        isCombo: !!selectedCombo,
        comboName: selectedCombo || null,
      };

      if (editingId) {
        setAppointments(
          appointments.map((appt) =>
            appt.id === editingId ? newAppointment : appt
          )
        );
        setSuccessMessage('Appointment updated successfully!');
      } else {
        setAppointments([...appointments, newAppointment]);
        setSuccessMessage('Appointment booked successfully!');
      }

      setSelectedDate('');
      setSelectedTime('');
      setSelectedServices([]);
      setSelectedCombo('');
      setDescription('');
      setEditingId(null);
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleEdit = (appt) => {
    setSelectedDate(appt.date);
    setSelectedTime(appt.time);
    setSelectedServices(appt.isCombo ? [] : appt.services);
    setSelectedCombo(appt.isCombo ? appt.comboName : '');
    setDescription(appt.description);
    setEditingId(appt.id);
    setErrorMessage('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter((appt) => appt.id !== id));
      setSuccessMessage('Appointment deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleReset = () => {
    setSelectedDate('');
    setSelectedTime('');
    setSelectedServices([]);
    setSelectedCombo('');
    setDescription('');
    setEditingId(null);
    setErrorMessage('');
  };

  const removeService = (serviceName) => {
    setSelectedServices(selectedServices.filter((s) => s !== serviceName));
  };

  useEffect(() => {
    if (selectedDate || selectedTime || selectedServices.length || selectedCombo || description) {
      setSuccessMessage('');
    }
  }, [selectedDate, selectedTime, selectedServices, selectedCombo, description]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-12 px-4">
      <header className="flex justify-center items-center max-w-7xl mx-auto mb-10">
        <div className="flex items-center gap-4">
          <img
            alt="AutoCare Logo"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="h-12 w-auto"
            onError={(e) => { e.target.src = 'https://picsum.photos/200'; }}
          />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent tracking-tight">
            AutoCare Appointments
          </h1>
        </div>
      </header>

      {successMessage && (
        <div className="max-w-7xl mx-auto mb-8 transition-opacity duration-300">
          <div className="bg-green-100 border-l-4 border-green-600 text-green-800 p-4 rounded-lg shadow-md">
            <p>{successMessage}</p>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="max-w-7xl mx-auto mb-8 transition-opacity duration-300">
          <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 rounded-lg shadow-md">
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
          {editingId ? 'Edit Your Appointment' : 'Book a New Appointment'}
        </h2>
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime('');
                  setErrorMessage('');
                }}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-base p-2 border transition duration-150 ease-in-out"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Select Time</label>
              <select
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                  setErrorMessage('');
                }}
                disabled={!selectedDate}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-base p-2 border transition duration-150 ease-in-out"
                required
              >
                <option value="">Select a time slot</option>
                {selectedDate &&
                  getAvailableTimeSlots(selectedDate).map((slot) => (
                    <option key={slot} value={slot} disabled={slot === 'No slots available'}>
                      {slot}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Select Combo Package or Services</label>
              <select
                value={selectedCombo}
                onChange={(e) => {
                  setSelectedCombo(e.target.value);
                  setSelectedServices([]);
                  setErrorMessage('');
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-base p-2 border transition duration-150 ease-in-out"
              >
                <option value="">Select a combo package (optional)</option>
                {comboPackages.map((pkg) => (
                  <option key={pkg.name} value={pkg.name}>
                    {pkg.name} (Rs.{pkg.price.toFixed(2)} - Save Rs.{(pkg.originalPrice - pkg.price).toFixed(2)})
                  </option>
                ))}
              </select>
              {!selectedCombo && (
                <div className="mt-4">
                  <label className="block text-sm text-gray-500 mb-2">Hold Ctrl (Cmd on Mac) to select multiple services</label>
                  <select
                    multiple
                    value={selectedServices}
                    onChange={(e) => {
                      const newServices = Array.from(e.target.selectedOptions, (option) => option.value);
                      setSelectedServices(newServices);
                      setErrorMessage('');
                      console.log('Selected services:', newServices);
                    }}
                    className="block w-full h-36 rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-base p-2 border transition duration-150 ease-in-out"
                  >
                    {services.map((service) => (
                      <option key={service.name} value={service.name}>
                        {service.name} (Rs.{service.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedServices.map((service) => (
                      <div
                        key={service}
                        className="flex items-center bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-indigo-200 transition duration-150"
                      >
                        {service}
                        <span
                          className="ml-2 h-5 w-5 cursor-pointer text-indigo-600 hover:text-indigo-800"
                          onClick={() => removeService(service)}
                        >
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Focus on scratches on the hood"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-base p-2 border transition duration-150 ease-in-out"
                rows="5"
              />
            </div>
            <div className="mt-6">
              <p className="text-lg font-bold text-indigo-600">
                Total: Rs.{totalPrice.toFixed(2)}
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-md bg-gray-200 px-6 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition duration-150 ease-in-out"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white hover:bg-indigo-700 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition duration-150 ease-in-out ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading
                  ? 'Processing...'
                  : editingId
                  ? 'Update Appointment'
                  : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Your Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No appointments booked yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="border border-gray-200 rounded-xl shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {appt.date} at {appt.time}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    <strong>{appt.isCombo ? 'Package' : 'Services'}:</strong>{' '}
                    {appt.isCombo ? appt.comboName : appt.services.join(', ')}
                  </p>
                  <p className="mt-2 text-gray-600">
                    <strong>Description:</strong> {appt.description || 'None'}
                  </p>
                  <p className="mt-2 text-lg font-bold text-indigo-600">
                    Total: Rs.{appt.totalPrice.toFixed(2)}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(appt)}
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 hover:scale-105 transition duration-150 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(appt.id)}
                      className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 hover:scale-105 transition duration-150 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto mt-12 text-center">
        <p className="text-lg text-gray-600 mb-4">Need help? Contact us to manage your bookings!</p>
        <button className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white hover:bg-indigo-700 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition duration-150 ease-in-out">
          Contact Us
        </button>
      </div>
    </div>
  );
}