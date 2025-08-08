import { FaCar, FaTools, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="w-full bg-blue-500"> {/* Full-width wrapper */}
      <footer className="text-white pt-12 pb-6 container mx-auto px-4"> {/* Contained content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <FaCar className="text-blue-500 text-3xl mr-2" />
              <h3 className="text-xl font-bold">AutoCare Pro</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for all vehicle service needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition flex items-center"><FaTools className="mr-2" /> Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition flex items-center"><FaCar className="mr-2" /> Book Appointment</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition flex items-center"><FaTools className="mr-2" /> Maintenance</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition flex items-center"><FaCar className="mr-2" /> Diagnostics</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-500 mt-1 mr-3" />
                <span>123 Garage Lane, Auto City</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-blue-500 mr-3" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-blue-500 mr-3" />
                <span>service@autocarepro.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Service Alerts</h3>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AutoCare Pro
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-blue-500 transition">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-blue-500 transition">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};



export default Footer;