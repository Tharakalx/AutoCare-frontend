import { FaCar, FaTools, FaCalendarAlt, FaUserCircle, FaPhone, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
                        <span className="text-xl font-bold text-gray-800"><Link to="/">AutoCare</Link></span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">

                        <FaTools className="mr-1.5" /> <Link to="/services" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">Services</Link>


                        <FaCalendarAlt className="mr-1.5" /> <Link to="/appointments" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">Book Service</Link>


                        <FaUserCircle className="mr-1.5" /> <Link to="/my-vehicles" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">My Vehicles</Link>

                        <a href="#" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            <FaPhone className="mr-1.5" /> (+94) 786855633
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
                    
                        <FaTools className="mr-2" /> <Link to="/services" className="block py-2 text-gray-700 hover:text-blue-600 flex items-center">Services</Link>
                    
                   
                        <FaCalendarAlt className="mr-2" /> <Link to="/book-service" className="block py-2 text-gray-700 hover:text-blue-600 flex items-center">Book Service</Link>
                
                   
                        <FaUserCircle className="mr-2" /> <Link to="/my-vehicles" >My Vehicles</Link>
                    
                    <a href="#" className="block py-2 text-blue-600 flex items-center">
                        <FaPhone className="mr-2" /> Call Us
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Navbar;