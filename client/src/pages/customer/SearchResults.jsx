import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { vehicleAPI } from '../../services/api';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowLeft,
  Route,
  DollarSign,
  Gauge,
  Users,
  ChevronRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state;

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (!searchData) {
      navigate('/');
      return;
    }
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await vehicleAPI.getAll();
      const allVehicles = response.data.data;

      const compatibleVehicles = allVehicles.filter(vehicle => {
        if (vehicle.service_type === 'Both') {
          return true;
        }
        return vehicle.service_type === searchData.serviceType;
      });

      setVehicles(compatibleVehicles);
      
      const estimatedDistance = calculateDistance(
        searchData.pickupLocation,
        searchData.dropLocation
      );
      setDistance(estimatedDistance);
    } catch (err) {
      setError('Failed to fetch vehicles. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (pickup, drop) => {
    const pickup_lower = pickup.toLowerCase();
    const drop_lower = drop.toLowerCase();

    if (pickup_lower === drop_lower) {
      return 5;
    }

    const longRoutes = [
      ['chennai', 'bangalore'],
      ['chennai', 'trichy'],
      ['bangalore', 'hyderabad'],
      ['mumbai', 'pune'],
      ['delhi', 'jaipur']
    ];

    const isLongRoute = longRoutes.some(route => 
      (pickup_lower.includes(route[0]) && drop_lower.includes(route[1])) ||
      (pickup_lower.includes(route[1]) && drop_lower.includes(route[0]))
    );

    if (isLongRoute) {
      return Math.floor(Math.random() * 200) + 200;
    }

    return Math.floor(Math.random() * 100) + 50;
  };

  const calculateFare = (vehicle) => {
    const fare = (distance * vehicle.rate_per_km) + parseFloat(vehicle.base_fare);
    return fare.toFixed(2);
  };

  const handleBooking = (vehicle) => {
    navigate(`/booking/${vehicle.id}`, {
      state: {
        ...searchData,
        vehicle,
        distance,
        estimatedFare: calculateFare(vehicle),
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Finding best vehicles for you...</p>
        </div>
      </div>
    );
  }

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
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Search</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Trip Summary Card - Premium Design */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 mt-8 border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Route className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Your Journey</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Car className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Service Type</p>
                <p className="font-bold text-gray-800">{searchData.serviceType}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 font-medium">Pickup</p>
                <p className="font-bold text-gray-800 truncate">{searchData.pickupLocation}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 font-medium">Drop</p>
                <p className="font-bold text-gray-800 truncate">{searchData.dropLocation}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Date & Time</p>
                <p className="font-bold text-gray-800 text-sm">
                  {new Date(searchData.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs text-gray-600">{searchData.pickupTime}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Route className="w-5 h-5" />
                <span className="font-semibold">Estimated Distance</span>
              </div>
              <span className="text-2xl font-bold">{distance} km</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Header with Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Available Vehicles
              <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                {vehicles.length} {vehicles.length === 1 ? 'Vehicle' : 'Vehicles'}
              </span>
            </h2>
          </div>
        </div>

        {/* Vehicles Grid - Compact Premium Cards */}
        {vehicles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg mb-2 font-semibold">
              No vehicles available
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Try selecting a different service type or check back later.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-semibold inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Search Again
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
              >
                {/* Vehicle Image with Overlay Badge */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={vehicle.image_url || 'https://via.placeholder.com/400x200?text=Taxi'}
                    alt={vehicle.vehicle_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {vehicle.service_type}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Vehicle Info - Compact */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Car className="w-5 h-5 text-blue-600" />
                    {vehicle.vehicle_name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {vehicle.vehicle_info || 'Comfortable and reliable ride'}
                  </p>

                  {/* Pricing Grid - Compact */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Gauge className="w-4 h-4" />
                        Rate/km
                      </span>
                      <span className="font-bold text-gray-800">₹{vehicle.rate_per_km}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        Base Fare
                      </span>
                      <span className="font-bold text-gray-800">₹{vehicle.base_fare}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded-lg">
                      <span className="text-blue-700 flex items-center gap-1">
                        <Route className="w-4 h-4" />
                        Distance
                      </span>
                      <span className="font-bold text-blue-700">{distance} km</span>
                    </div>
                  </div>

                  {/* Total Fare - Prominent */}
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100 text-sm font-medium">Total Fare</span>
                      <span className="text-2xl font-bold text-white">
                        ₹{calculateFare(vehicle)}
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleBooking(vehicle)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    Book Now
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
