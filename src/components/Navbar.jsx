import { FaCar, FaTools, FaCalendarAlt, FaUserCircle, FaPhone, FaBars } from 'react-icons/fa';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top alert bar */}
      <div className="bg-blue-600 text-white text-center py-1.5 px-4 text-sm">
        🚘 Free vehicle inspection with every service this month!
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <FaCar className="text-blue-600 text-2xl mr-2" />
            <span className="text-xl font-bold text-gray-800">AutoCare Pro</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
              <FaTools className="mr-1.5" /> Services
            </a>
            <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
              <FaCalendarAlt className="mr-1.5" /> Book Service
            </a>
            <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
              <FaUserCircle className="mr-1.5" /> My Vehicles
            </a>
            <a href="#" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              <FaPhone className="mr-1.5" /> (555) 123-4567
            </a>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-700 hover:text-blue-600">
            <FaBars className="text-xl" />
          </button>
        </div>
      </div>

      {/* Mobile menu (hidden by default) */}
      <div className="md:hidden bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-2 space-y-2">
          <a href="#" className="block py-2 text-gray-700 hover:text-blue-600 flex items-center">
            <FaTools className="mr-2" /> Services
          </a>
          <a href="#" className="block py-2 text-gray-700 hover:text-blue-600 flex items-center">
            <FaCalendarAlt className="mr-2" /> Book Service
          </a>
          <a href="#" className="block py-2 text-gray-700 hover:text-blue-600 flex items-center">
            <FaUserCircle className="mr-2" /> My Vehicles
          </a>
          <a href="#" className="block py-2 text-blue-600 flex items-center">
            <FaPhone className="mr-2" /> Call Us
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;