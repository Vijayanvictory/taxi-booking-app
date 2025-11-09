import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Zap, 
  Shield, 
  DollarSign,
  Menu,
  X,
  Home,
  Phone,
  Mail,
  ChevronRight,
  Bike,
  Truck
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: 'One-Way',
    pickupLocation: '',
    dropLocation: '',
    pickupDate: '',
    pickupTime: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/search', { state: formData });
  };

  const today = new Date().toISOString().split('T')[0];

  const services = [
    {
      icon: Car,
      title: 'Taxi / Cab',
      description: 'Comfortable rides for city & outstation',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Bike,
      title: 'Bike',
      description: 'Quick & affordable bike rides',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Truck,
      title: 'Auto',
      description: 'Economical auto rickshaw service',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Quick Booking',
      description: 'Book your ride in under 2 minutes'
    },
    {
      icon: DollarSign,
      title: 'Best Prices',
      description: 'Transparent pricing with no hidden charges'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Verified drivers and secure payments'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaxiBook
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <a href="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
                <Home className="w-4 h-4" />
                <span className="font-medium">Home</span>
              </a>
              <a href="#services" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
                <Car className="w-4 h-4" />
                <span className="font-medium">Services</span>
              </a>
              <a href="#contact" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
                <Phone className="w-4 h-4" />
                <span className="font-medium">Contact</span>
              </a>
              <a 
                href="/admin/login" 
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-medium"
              >
                Admin Login
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t animate-slide-down">
              <div className="flex flex-col gap-3">
                <a href="/" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </a>
                <a href="#services" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Car className="w-4 h-4" />
                  <span>Services</span>
                </a>
                <a href="#contact" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Phone className="w-4 h-4" />
                  <span>Contact</span>
                </a>
                <a href="/admin/login" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center">
                  Admin Login
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Background */}
      <div className="relative pt-20 md:pt-24 pb-16 md:pb-24 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-purple-900/85 to-blue-900/90"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Hero Text */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Your Ride, Your Way
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-2">
              Comfortable, Reliable, and Affordable
            </p>
            <p className="text-lg text-blue-200">
              Book taxi, bike, or auto in seconds
            </p>
          </div>

          {/* Search Form Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Plan Your Journey</h3>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Service Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Trip Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition ${
                      formData.serviceType === 'One-Way'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}>
                      <input
                        type="radio"
                        name="serviceType"
                        value="One-Way"
                        checked={formData.serviceType === 'One-Way'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <ChevronRight className="w-5 h-5" />
                      <span className="font-semibold">One-Way</span>
                    </label>
                    <label className={`flex items-center justify-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition ${
                      formData.serviceType === 'Round Trip'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}>
                      <input
                        type="radio"
                        name="serviceType"
                        value="Round Trip"
                        checked={formData.serviceType === 'Round Trip'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <Car className="w-5 h-5" />
                      <span className="font-semibold">Round Trip</span>
                    </label>
                  </div>
                </div>

                {/* Location Fields */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Enter pickup location"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Drop Location
                    </label>
                    <input
                      type="text"
                      name="dropLocation"
                      value={formData.dropLocation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Enter drop location"
                      required
                    />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleChange}
                      min={today}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Pickup Time
                    </label>
                    <input
                      type="time"
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Car className="w-5 h-5" />
                  Search Available Vehicles
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">Choose your preferred ride</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-gray-100 hover:border-blue-200"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600">Experience the difference</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Need Help?</h2>
          <p className="text-xl text-blue-100 mb-8">We're here 24/7 to assist you</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="tel:+919876543210" className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-xl transition">
              <Phone className="w-5 h-5" />
              +91 98765 43210
            </a>
            <a href="mailto:support@taxibook.com" className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-xl transition">
              <Mail className="w-5 h-5" />
              support@taxibook.com
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2025 TaxiBook. All rights reserved.</p>
          <p className="text-sm text-gray-500">Made with ❤️ for better travel experience</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
