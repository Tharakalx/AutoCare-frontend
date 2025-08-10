import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import { FaCar } from 'react-icons/fa';

export default function OurServices() {
  const services = [
    {
      name: "Under Wash",
      description: "Clean your vehicle’s undercarriage to remove dirt and prevent corrosion.",
      price: 5000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQs5zTV6Qn4ykh_z5JjrPt4nE54phM94MrHA&s",
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
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy6xQgSMYZo7RMmTmEyglQQs2TbsT3xqBQBw&s",
    },
    {
      name: "Cut and Polish",
      description: "Restore your vehicle’s shine by removing scratches and enhancing gloss.",
      price: 15000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs0RycQ1_Q3i8AdXrWHPdy9pfzJIQZ-UMuLQ&s",
    },
    {
      name: "Interior Cleaning",
      description: "Refresh your vehicle’s interior with our deep cleaning and detailing service.",
      price: 10000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRTxZP03L33wtVmLUIe09JScxLjO_LqYazDw&s",
    },
    {
      name: "Engine Degreasing",
      description: "Clean and protect your engine with our thorough degreasing service.",
      price: 6000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz11ld_EiGrbImAdgw0quBKiD0IsBo6mEm5w&s",
    },
    {
      name: "Oil Change",
      description: "Keep your engine running smoothly with our premium oil change service.",
      price: 49.99,
      image: "https://www.steelehyundaikyle.com/assets/shared/CustomHTMLFiles/Compliance/Hyundai/images/oil-change-header.jpg",
    },
    {
      name: "Brake Service",
      description: "Ensure safety with our comprehensive brake inspection and repair.",
      price: 129.99,
      image: "https://cdn-ilddian.nitrocdn.com/cclTClxkiLnkxweuDsJamWEuJYamkxqL/assets/images/optimized/rev-97ef586/hcsrepair.com/wp-content/uploads/2024/09/HCS-Auto-Repair-Brake-Repair-2-Springdale-Rogers-Arkansas-1024x683.png",
    },
    {
      name: "Tire Service",
      description: "Tire rotation, balancing, and replacement for optimal performance.",
      price: 89.99,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzQS2G5PJ5SNX7qPv3zifRmxBZ0NYs3F9OQQ&s",
    },
    {
      name: "Engine Diagnostics",
      description: "Advanced diagnostics to identify and fix engine issues.",
      price: 99.99,
      image: "https://just-automotive.net/Files/Images/Blog/AdobeStock_341429200%20(Small).jpeg",
    },
    {
      name: "Air Conditioning Repair",
      description: "Stay cool with our A/C system recharge and repair.",
      price: 79.99,
      image: "https://aaa.scene7.com/is/image/aaaautoclubsouthstage/2-Car-AC-GettyImages-1182824484-1?ts=1736700036720&dpr=off",
    },
    {
      name: "Transmission Service",
      description: "Maintain smooth gear shifts with our transmission care.",
      price: 149.99,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTipOI9DAfr-NxJBIGeNTKCNSOm63klRgzGYQ&s",
    },
    {
      name: "Battery Service",
      description: "Battery testing and replacement for reliable starts.",
      price: 69.99,
      image: "https://media.infopay.net/thumbnails/Bs5vHtQgRNpxhbz0tQHNPbynolEozoXqT0WJdVTO.webp",
    },
    {
      name: "Wheel Alignment",
      description: "Improve handling and tire life with precise alignment.",
      price: 59.99,
      image: "https://www.popularmaruti.com/blog/wp-content/uploads/2022/08/wheels.jpg",
    },
    {
      name: "Engine Tune-Up",
      description: "Optimize your vehicle's performance with our comprehensive engine tune-up service.",
      price: 24000,
      image: "https://omegaautocare.com/wp-content/uploads/2023/02/car-tune-up-basics.jpg"
    }
  ];

  const comboPackages = [
    {
      name: "Essential Maintenance Package",
      services: ["Oil Change", "Tire Service", "Battery Service"],
      price: 159.99,
      originalPrice: 209.97,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHKVhT8TiAJe_fr7HXDOVrzPqaBSpB1F10qw&s",
    },
    {
      name: "Complete Care Package",
      services: ["Oil Change", "Brake Service", "Wheel Alignment", "Air Conditioning", "Full Body Wash"],
      price: 279.99,
      originalPrice: 319.96,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-tmwcIHAsBwvZxYsVTwvt22VGbZiX8EwasQ&s",
    },
    {
      name: "Premium Performance Package",
      services: ["Engine Diagnostics", "Transmission Service", "Wheel Alignment"],
      price: 269.99,
      originalPrice: 309.97,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuFoTItOoseCHC2ebauxcOAwQOqzdJNbTIFw&s",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
        {/* Header */}
        <header className="flex items-center justify-between max-w-7xl mx-auto mb-8">


          <div className="flex items-center">
            <FaCar className="text-blue-600 text-2xl mr-2" />
            <span className="text-3xl font-bold text-gray-800">AutoCare Systems </span>
          </div>

        </header>

        {/* Services Section */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="border border-gray-200 rounded-lg shadow-md bg-white overflow-hidden">
                <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                  <p className="mt-2 text-gray-600">{service.description}</p>
                  <p className="mt-4 text-lg font-bold text-indigo-600">Rs.{service.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Combo Packages Section */}
        <div className="max-w-7xl mx-auto mt-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Combo Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comboPackages.map((pkg, index) => (
              <div key={index} className="border border-gray-200 rounded-lg shadow-md bg-white overflow-hidden">
                <img src={pkg.image} alt={pkg.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>
                  <ul className="mt-2 text-gray-600 list-disc list-inside">
                    {pkg.services.map((service, i) => (
                      <li key={i}>{service}</li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <p className="text-lg font-bold text-indigo-600">Rs.{pkg.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 line-through">Rs.{pkg.originalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Call to Action */}
        <div className="max-w-7xl mx-auto mt-12 text-center">
          <p className="text-lg text-gray-600 mb-4">Ready to book your service? Sign up now to get started!</p>
          <button className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <Link to="/register">Sign Up Now</Link>
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}