import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayCount: 0,
    totalCount: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    
    if (!token || !adminUser) {
      navigate('/admin/login');
      return;
    }

    setAdmin(JSON.parse(adminUser));
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const response = await bookingAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">🚖 TaxiBook Admin</h1>
            <div className="flex items-center gap-6">
              <span className="text-gray-600">Welcome, {admin?.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-3 font-semibold text-blue-600 border-b-2 border-blue-600"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/admin/vehicles')}
              className="px-4 py-3 text-gray-600 hover:text-blue-600 transition"
            >
              Vehicles
            </button>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="px-4 py-3 text-gray-600 hover:text-blue-600 transition"
            >
              Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Bookings */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Today's Bookings</p>
                <p className="text-4xl font-bold">{stats.todayCount}</p>
              </div>
              <div className="text-5xl opacity-20">📅</div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Bookings</p>
                <p className="text-4xl font-bold">{stats.totalCount}</p>
              </div>
              <div className="text-5xl opacity-20">📊</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-2">Quick Actions</p>
                <button
                  onClick={() => navigate('/admin/vehicles')}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
                >
                  Add Vehicle
                </button>
              </div>
              <div className="text-5xl opacity-20">⚡</div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Recent Bookings ({stats.recentBookings.length})
          </h3>

          {stats.recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No bookings yet</p>
              <p className="text-gray-400 text-sm mt-2">Bookings will appear here once customers start booking</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ref ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pickup</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Fare</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">
                        {booking.reference_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {booking.user_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.vehicle_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.pickup_location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(booking.pickup_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        ₹{booking.estimated_fare}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {stats.recentBookings.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/admin/bookings')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View All Bookings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
