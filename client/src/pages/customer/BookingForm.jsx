import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../../services/api';
import {
  Car,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Route,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  CreditCard,
  Gauge
} from 'lucide-react';

const BookingForm = () => {
  const { vehicleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [formData, setFormData] = useState({
    user_name: '',
    user_mobile: '',
    user_email: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  if (!bookingData) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.user_name.trim()) {
      errors.user_name = 'Name is required';
    } else if (formData.user_name.trim().length < 2) {
      errors.user_name = 'Name must be at least 2 characters';
    }

    // Mobile validation - exactly 10 digits
    if (!formData.user_mobile.trim()) {
      errors.user_mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.user_mobile.trim())) {
      errors.user_mobile = 'Please enter a valid 10-digit mobile number';
    }

    // Email validation - ONLY if provided
    if (formData.user_email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.user_email.trim())) {
        errors.user_email = 'Please enter a valid email address';
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const bookingPayload = {
        vehicle_id: parseInt(vehicleId),
        service_type: bookingData.serviceType,
        pickup_location: bookingData.pickupLocation,
        drop_location: bookingData.dropLocation,
        pickup_date: bookingData.pickupDate,
        pickup_time: bookingData.pickupTime,
        distance: bookingData.distance,
        estimated_fare: parseFloat(bookingData.estimatedFare),
        user_name: formData.user_name.trim(),
        user_mobile: formData.user_mobile.trim(),
        user_email: formData.user_email.trim() || null,
      };

      const response = await bookingAPI.create(bookingPayload);

      navigate(`/success/${response.data.referenceId}`, {
        state: {
          booking: response.data.data,
          vehicle: bookingData.vehicle,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.error ||
        'Failed to create booking. Please try again.'
      );
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      {/* Premium Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-md mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaxiBook
              </span>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600">
            Just one step away from your ride!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Booking Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-6 h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              Booking Summary
            </h2>

            {/* Vehicle Card */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="flex items-center gap-4">
                <img
                  src={bookingData.vehicle.image_url || 'https://via.placeholder.com/80'}
                  alt={bookingData.vehicle.vehicle_name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {bookingData.vehicle.vehicle_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {bookingData.vehicle.vehicle_info || 'Premium vehicle'}
                  </p>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-semibold text-gray-800">{bookingData.serviceType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Pickup</p>
                  <p className="font-semibold text-gray-800">{bookingData.pickupLocation}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Drop</p>
                  <p className="font-semibold text-gray-800">{bookingData.dropLocation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {new Date(bookingData.pickupDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold text-gray-800 text-sm">{bookingData.pickupTime}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Route className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="font-semibold text-gray-800">{bookingData.distance} km</p>
                </div>
              </div>
            </div>

            {/* Fare Card */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-100">Total Fare</span>
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="text-4xl font-bold mb-1">
                ₹{bookingData.estimatedFare}
              </div>
              <p className="text-sm text-green-100">
                Including all taxes
              </p>
            </div>
          </div>

          {/* Right: Passenger Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              Passenger Details
            </h2>
            <p className="text-gray-600 mb-6">
              We'll send booking confirmation to you
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
                      validationErrors.user_name
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {validationErrors.user_name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span>
                    {validationErrors.user_name}
                  </p>
                )}
              </div>

              {/* Mobile Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="user_mobile"
                    value={formData.user_mobile}
                    onChange={handleChange}
                    maxLength="10"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
                      validationErrors.user_mobile
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
                {validationErrors.user_mobile && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span>
                    {validationErrors.user_mobile}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  We'll send booking updates on this number
                </p>
              </div>

              {/* Email Field - Optional */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${
                      validationErrors.user_email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {validationErrors.user_email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span>
                    {validationErrors.user_email}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Email confirmation is optional
                </p>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Your information is safe</p>
                    <p>We use your details only for booking confirmation and updates.</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Confirm Booking
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
