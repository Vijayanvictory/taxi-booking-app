import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Car,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Route,
  DollarSign,
  Copy,
  Home,
  Share2,
  Download,
  Sparkles,
  PartyPopper
} from 'lucide-react';

const BookingSuccess = () => {
  const { referenceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, vehicle } = location.state || {};

  useEffect(() => {
    if (!booking || !vehicle) {
      navigate('/');
    }
  }, [booking, vehicle, navigate]);

  if (!booking || !vehicle) {
    return null;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referenceId);
    alert('Booking ID copied to clipboard!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TaxiBook Booking',
        text: `My booking ID: ${referenceId}`,
      });
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Premium Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm relative z-10">
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
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Success Animation Section */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Success Icon with Pulse */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative w-28 h-28 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
              <CheckCircle className="w-16 h-16 text-white animate-bounce-slow" />
            </div>
            {/* Sparkles */}
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
            <PartyPopper className="absolute -top-2 -left-2 w-8 h-8 text-pink-400 animate-pulse delay-300" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🎉 Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your ride is all set and ready to go
          </p>
          <p className="text-sm text-gray-500">
            We've sent confirmation details to your phone
          </p>
        </div>

        {/* Reference ID Card */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white text-center transform hover:scale-105 transition-transform">
            <p className="text-green-100 font-medium mb-2">Your Booking ID</p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <p className="text-4xl md:text-5xl font-bold tracking-wider">
                {referenceId}
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-5 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition backdrop-blur-sm font-medium"
              >
                <Copy className="w-4 h-4" />
                Copy ID
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition backdrop-blur-sm font-medium"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Booking Details Cards */}
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Trip Details */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Route className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Trip Details</h3>
            </div>

            <div className="space-y-4">
              {/* Vehicle */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={vehicle.image_url || 'https://via.placeholder.com/80'}
                    alt={vehicle.vehicle_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Vehicle</p>
                  <p className="font-bold text-gray-800">{vehicle.vehicle_name}</p>
                  <p className="text-sm text-gray-600">{booking.service_type}</p>
                </div>
              </div>

              {/* Pickup */}
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Pickup Location</p>
                  <p className="font-semibold text-gray-800">{booking.pickup_location}</p>
                </div>
              </div>

              {/* Drop */}
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                <MapPin className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Drop Location</p>
                  <p className="font-semibold text-gray-800">{booking.drop_location}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-xl">
                  <Calendar className="w-4 h-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Date</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {new Date(booking.pickup_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-xl">
                  <Clock className="w-4 h-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Time</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {booking.pickup_time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Distance & Fare */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-xl">
                  <Route className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Distance</p>
                    <p className="font-semibold text-gray-800">{booking.distance} km</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-green-50 rounded-xl">
                  <DollarSign className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Total Fare</p>
                    <p className="font-semibold text-gray-800">₹{booking.estimated_fare}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Passenger Details</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <User className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Full Name</p>
                  <p className="font-semibold text-gray-800">{booking.user_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <Phone className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Mobile Number</p>
                  <p className="font-semibold text-gray-800">{booking.user_mobile}</p>
                </div>
              </div>

              {booking.user_email && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                  <Mail className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Email Address</p>
                    <p className="font-semibold text-gray-800 break-words">{booking.user_email}</p>
                  </div>
                </div>
              )}

              {/* Important Info Box */}
              <div className="mt-6 p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">ℹ</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Important</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Please be ready 10 minutes before pickup time</li>
                      <li>• Driver will contact you shortly</li>
                      <li>• Keep your booking ID handy</li>
                      <li>• Pay driver after ride completion</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Download Receipt Button */}
              <button
                className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Receipt
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-2xl mx-auto mt-12 mb-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Book Another Ride
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-300 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Print Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
