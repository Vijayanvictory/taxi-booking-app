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

  if (!bookingData) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
        user_name: formData.user_name,
        user_mobile: formData.user_mobile,
        user_email: formData.user_email || null,
      };

      const response = await bookingAPI.create(bookingPayload);
      
      navigate(`/success/${response.data.referenceId}`, {
        state: {
          booking: response.data.data,
          vehicle: bookingData.vehicle,
        },
      });
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Failed to create booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Premium Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaxiBook
              </span>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Complete Your Booking
          </h2>
          <p className="text-gray-600">Just one step away from your ride!</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Trip Summary Card - 2 columns on large screens */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 sticky top-24">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Route className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Trip Summary</h3>
                </div>

                {/* Vehicle Info */}
                <div className="mb-6">
                  <div className="relative rounded-xl overflow-hidden mb-4">
                    <img
                      src={bookingData.vehicle.image_url || 'https://via.placeholder.com/400x200?text=Taxi'}
                      alt={bookingData.vehicle.vehicle_name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-lg text-gray-800">
                      {bookingData.vehicle.vehicle_name}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {bookingData.vehicle.vehicle_info || 'Premium vehicle'}
                  </p>
                </div>

                {/* Trip Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Car className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-medium">Service Type</p>
                      <p className="font-semibold text-gray-800">{bookingData.serviceType}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-medium">Pickup</p>
                      <p className="font-semibold text-gray-800">{bookingData.pickupLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-medium">Drop</p>
                      <p className="font-semibold text-gray-800">{bookingData.dropLocation}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-medium">Date</p>
                        <p className="font-semibold text-gray-800 text-sm">
                          {new Date(bookingData.pickupDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                      <Clock className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-medium">Time</p>
                        <p className="font-semibold text-gray-800 text-sm">{bookingData.pickupTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Gauge className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-medium">Distance</p>
                      <p className="font-semibold text-gray-800">{bookingData.distance} km</p>
                    </div>
                  </div>
                </div>

                {/* Fare Breakdown */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="p-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-blue-100 font-medium">Total Fare</span>
                      <DollarSign className="w-5 h-5 text-blue-200" />
                    </div>
                    <p className="text-3xl font-bold">₹{bookingData.estimatedFare}</p>
                    <p className="text-xs text-blue-100 mt-1">Including all taxes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Details Form - 3 columns on large screens */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-blue-100">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Your Details</h3>
                    <p className="text-sm text-gray-600">We'll send booking confirmation to you</p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
                    <div className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5">⚠</div>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <User className="w-4 h-4 text-blue-600" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 placeholder:text-gray-400"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Phone className="w-4 h-4 text-green-600" />
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="user_mobile"
                      value={formData.user_mobile}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 placeholder:text-gray-400"
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                      required
                    />
                    <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Your number is safe with us
                    </p>
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Mail className="w-4 h-4 text-orange-600" />
                      Email Address
                      <span className="text-xs font-normal text-gray-500">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="user_email"
                      value={formData.user_email}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 placeholder:text-gray-400"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Payment Info Box */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">Payment Information</h4>
                        <p className="text-sm text-gray-600">
                          Pay directly to the driver after your ride. We accept cash and UPI payments.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-600 text-center leading-relaxed">
                      By confirming this booking, you agree to our{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="spinner border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Confirm Booking
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
