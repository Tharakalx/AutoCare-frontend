import { useState, useEffect } from 'react';
import { FaFilePdf, FaTrash } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function AdminDashboard() {
  const services = [
    { name: 'Under Wash', price: 5000 },
    { name: 'Body Wash', price: 3000 },
    { name: 'Body Wax', price: 8000 },
    { name: 'Cut and Polish', price: 15000 },
    { name: 'Interior Cleaning', price: 10000 },
    { name: 'Engine Degreasing', price: 6000 },
    { name: 'Oil Change', price: 15000 },
    { name: 'Brake Service', price: 39000 },
    { name: 'Tire Service', price: 27000 },
    { name: 'Engine Diagnostics', price: 30000 },
    { name: 'Air Conditioning Repair', price: 24000 },
    { name: 'Transmission Service', price: 45000 },
    { name: 'Battery Service', price: 21000 },
    { name: 'Wheel Alignment', price: 18000 },
    { name: 'Engine Tune-Up', price: 24000 },
  ];

  const comboPackages = [
    { name: 'Essential Maintenance Package', services: ['Oil Change', 'Tire Service', 'Battery Service'], price: 48000 },
    { name: 'Complete Care Package', services: ['Oil Change', 'Brake Service', 'Wheel Alignment', 'Air Conditioning Repair', 'Body Wash'], price: 84000 },
    { name: 'Premium Performance Package', services: ['Engine Diagnostics', 'Transmission Service', 'Wheel Alignment'], price: 81000 },
  ];

  const [appointments, setAppointments] = useState([]);
  const [stocks, setStocks] = useState([
    { id: 1, item: 'Engine Oil (5L)', quantity: 50, price: 5000 },
    { id: 2, item: 'Brake Pads (Set)', quantity: 30, price: 8000 },
    { id: 3, item: 'Tires (Each)', quantity: 20, price: 12000 },
  ]);
  const [billModal, setBillModal] = useState({ open: false, appointment: null, extraServices: [], adjustedPrice: 0 });
  const [message, setMessage] = useState('');

  const customers = appointments.map((appt, idx) => ({
    id: appt.id,
    name: `Customer ${idx + 1}`,
    email: `customer${idx + 1}@example.com`,
    phone: `+94${Math.floor(100000000 + Math.random() * 900000000)}`,
  }));

  const deleteAppointment = (id) => {
    if (window.confirm('Delete this appointment?')) {
      setAppointments(appointments.filter((appt) => appt.id !== id));
      setMessage('Appointment deleted!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const editStock = (id, field, value) => {
    setStocks(stocks.map((stock) =>
      stock.id === id ? { ...stock, [field]: field === 'quantity' ? parseInt(value) || 0 : parseFloat(value) || 0 } : stock
    ));
  };

  const openBillModal = (appt) => {
    const totalPrice = appt.isCombo
      ? comboPackages.find((pkg) => pkg.name === appt.comboName)?.price || 0
      : appt.services.reduce((sum, serviceName) => {
          const service = services.find((s) => s.name === serviceName);
          return sum + (service ? service.price : 0);
        }, 0);
    setBillModal({ open: true, appointment: appt, extraServices: [], adjustedPrice: totalPrice });
  };

  const addExtraService = (serviceName) => {
    if (!billModal.extraServices.includes(serviceName)) {
      const service = services.find((s) => s.name === serviceName);
      setBillModal({
        ...billModal,
        extraServices: [...billModal.extraServices, serviceName],
        adjustedPrice: billModal.adjustedPrice + (service ? service.price : 0),
      });
    }
  };

  const removeExtraService = (serviceName) => {
    const service = services.find((s) => s.name === serviceName);
    setBillModal({
      ...billModal,
      extraServices: billModal.extraServices.filter((s) => s !== serviceName),
      adjustedPrice: billModal.adjustedPrice - (service ? service.price : 0),
    });
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(33, 150, 243);
      doc.text('AutoCare Service Bill', 20, 20);
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
      doc.text(`Customer: ${customers.find((c) => c.id === billModal.appointment.id)?.name || 'Unknown'}`, 20, 40);
      doc.text(`Appointment: ${billModal.appointment.date} at ${billModal.appointment.time}`, 20, 50);

      doc.autoTable({
        startY: 60,
        head: [['Service', 'Price (Rs.)']],
        body: [
          ...(billModal.appointment.isCombo
            ? [[billModal.appointment.comboName, comboPackages.find((pkg) => pkg.name === appt.comboName)?.price.toFixed(2)]]
            : billModal.appointment.services.map((s) => [s, services.find((svc) => svc.name === s)?.price.toFixed(2)])),
          ...billModal.extraServices.map((s) => [s, services.find((svc) => svc.name === s)?.price.toFixed(2)]),
        ],
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 3 },
      });

      doc.setFontSize(12);
      doc.text(`Total: Rs.${billModal.adjustedPrice.toFixed(2)}`, 20, doc.lastAutoTable.finalY + 10);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Thank you for choosing AutoCare!', 20, doc.lastAutoTable.finalY + 20);

      doc.save(`AutoCare_Bill_${billModal.appointment.id}.pdf`);
      setBillModal({ ...billModal, open: false });
      setMessage('Bill generated!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error generating PDF. Check console.');
      console.error(error);
    }
  };

  useEffect(() => {
    setAppointments([
      {
        id: 1,
        date: '2025-08-10',
        time: '10:00 AM',
        services: ['Oil Change', 'Tire Service'],
        description: 'Check tire pressure',
        totalPrice: 42000,
        isCombo: false,
        comboName: null,
      },
      {
        id: 2,
        date: '2025-08-11',
        time: '02:00 PM',
        services: ['Oil Change', 'Brake Service', 'Wheel Alignment', 'Air Conditioning Repair', 'Body Wash'],
        description: '',
        totalPrice: 84000,
        isCombo: true,
        comboName: 'Complete Care Package',
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-12 px-4">
      <header className="flex justify-center items-center max-w-5xl mx-auto mb-10">
        <img
          alt="AutoCare Logo"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="h-12 w-auto"
          onError={(e) => { e.target.src = 'https://picsum.photos/200'; }}
        />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent ml-4">
          Admin Dashboard
        </h1>
      </header>

      {message && (
        <div className="max-w-5xl mx-auto mb-8">
          <div className={`p-4 rounded-lg shadow-md ${message.includes('Error') ? 'bg-red-100 border-l-4 border-red-600 text-red-800' : 'bg-green-100 border-l-4 border-green-600 text-green-800'}`}>
            {message}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointments</h2>
          {!appointments.length ? (
            <p className="text-gray-600">No appointments available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Services</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total (Rs.)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{appt.date} {appt.time}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{appt.isCombo ? appt.comboName : appt.services.join(', ')}</td>
                      <td className="px-4 py-3 text-sm text-indigo-600 font-bold">{appt.totalPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm flex gap-3">
                        <button onClick={() => openBillModal(appt)} className="text-blue-600 hover:text-blue-800" title="Generate Bill">
                          <FaFilePdf size={16} />
                        </button>
                        <button onClick={() => deleteAppointment(appt.id)} className="text-red-600 hover:text-red-800" title="Delete">
                          <FaTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Customers</h2>
          {!customers.length ? (
            <p className="text-gray-600">No customers available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{customer.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{customer.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stock Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price (Rs.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stocks.map((stock) => (
                  <tr key={stock.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{stock.item}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <input
                        type="number"
                        value={stock.quantity}
                        onChange={(e) => editStock(stock.id, 'quantity', e.target.value)}
                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm p-1"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <input
                        type="number"
                        value={stock.price}
                        onChange={(e) => editStock(stock.id, 'price', e.target.value)}
                        className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm p-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {billModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Bill</h3>
            <p className="text-sm text-gray-600 mb-2">
              Appointment: {billModal.appointment.date} {billModal.appointment.time}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Services: {billModal.appointment.isCombo ? billModal.appointment.comboName : billModal.appointment.services.join(', ')}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Extra Services</label>
              <select
                onChange={(e) => addExtraService(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm p-2"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.name} value={service.name}>
                    {service.name} (Rs.{service.price.toFixed(2)})
                  </option>
                ))}
              </select>
              <div className="mt-2 flex flex-wrap gap-2">
                {billModal.extraServices.map((service) => (
                  <div key={service} className="flex items-center bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                    {service}
                    <span className="ml-2 cursor-pointer text-indigo-600 hover:text-indigo-800" onClick={() => removeExtraService(service)}>
                      ×
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Total (Rs.)</label>
              <input
                type="number"
                value={billModal.adjustedPrice}
                onChange={(e) => setBillModal({ ...billModal, adjustedPrice: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm p-2"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setBillModal({ ...billModal, open: false })}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300 hover:scale-105 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={generatePDF}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 hover:scale-105 transition duration-150"
              >
                Generate PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}