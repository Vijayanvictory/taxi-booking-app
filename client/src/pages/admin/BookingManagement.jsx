import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../../services/api';

const BookingManagement = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchBookings();
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters]);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getAll();
      setBookings(response.data.data);
      setFilteredBookings(response.data.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/admin/login');
      } else {
        setError('Failed to fetch bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(b => b.status === filters.status);
    }

    // Filter by search (reference ID, name, mobile, location)
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(b =>
        b.reference_id?.toLowerCase().includes(search) ||
        b.user_name?.toLowerCase().includes(search) ||
        b.user_mobile?.includes(search) ||
        b.pickup_location?.toLowerCase().includes(search) ||
        b.drop_location?.toLowerCase().includes(search)
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(b => 
        new Date(b.pickup_date) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(b => 
        new Date(b.pickup_date) <= new Date(filters.dateTo)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      search: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateStatus(bookingId, newStatus);
      setSuccess('Status updated successfully');
      fetchBookings();
      setTimeout(() => setSuccess(''), 3000);
      
      // Update modal if open
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (err) {
      setError('Failed to update status');
      console.error('Status update error:', err);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await bookingAPI.delete(bookingId);
      setSuccess('Booking deleted successfully');
      fetchBookings();
      closeModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete booking');
      console.error('Delete error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    return time?.substring(0, 5) || 'N/A';
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
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Admin Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-3 text-gray-600 hover:text-blue-600"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/admin/vehicles')}
              className="px-4 py-3 text-gray-600 hover:text-blue-600"
            >
              Vehicles
            </button>
            <button className="px-4 py-3 font-semibold text-blue-600 border-b-2 border-blue-600">
              Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Booking Management</h2>
            <p className="text-gray-600 mt-1">Total: {bookings.length} | Showing: {filteredBookings.length}</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Ref ID, Name, Mobile..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No bookings found</p>
            {filters.status !== 'all' || filters.search || filters.dateFrom || filters.dateTo ? (
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
            ) : (
              <p className="text-gray-400 text-sm mt-2">Bookings will appear here once customers start booking</p>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Ref ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Vehicle</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Route</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Fare</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openBookingDetails(booking)}>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-blue-600">{booking.reference_id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-800">{booking.user_name}</p>
                          <p className="text-gray-600">{booking.user_mobile}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-800">{booking.vehicle_name || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          <p className="truncate max-w-xs">📍 {booking.pickup_location}</p>
                          <p className="truncate max-w-xs">📍 {booking.drop_location}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          <p>{formatDate(booking.pickup_date)}</p>
                          <p>{formatTime(booking.pickup_time)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-800">₹{booking.estimated_fare}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openBookingDetails(booking);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Booking Details</h3>
                  <p className="text-blue-600 font-semibold mt-1">{selectedBooking.reference_id}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Booking Info Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Customer Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Customer Details</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Name:</span>
                      <p className="font-medium">{selectedBooking.user_name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Mobile:</span>
                      <p className="font-medium">{selectedBooking.user_mobile}</p>
                    </div>
                    {selectedBooking.user_email && (
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <p className="font-medium">{selectedBooking.user_email}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trip Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Trip Details</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Service Type:</span>
                      <p className="font-medium">{selectedBooking.service_type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Vehicle:</span>
                      <p className="font-medium">{selectedBooking.vehicle_name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Distance:</span>
                      <p className="font-medium">{selectedBooking.distance || 'N/A'} km</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Information */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Route Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Pickup Location:</span>
                    <p className="font-medium">📍 {selectedBooking.pickup_location}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Drop Location:</span>
                    <p className="font-medium">📍 {selectedBooking.drop_location}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Pickup Date:</span>
                      <p className="font-medium">{formatDate(selectedBooking.pickup_date)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Pickup Time:</span>
                      <p className="font-medium">{formatTime(selectedBooking.pickup_time)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fare Details */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Fare Details</h4>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Fare:</span>
                  <span className="text-2xl font-bold text-green-600">₹{selectedBooking.estimated_fare}</span>
                </div>
              </div>

              {/* Status Management */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Status Management</h4>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, 'pending')}
                    disabled={selectedBooking.status === 'pending'}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedBooking.status === 'pending'
                        ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                    disabled={selectedBooking.status === 'confirmed'}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedBooking.status === 'confirmed'
                        ? 'bg-green-200 text-green-800 cursor-not-allowed'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    Confirmed
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, 'completed')}
                    disabled={selectedBooking.status === 'completed'}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedBooking.status === 'completed'
                        ? 'bg-blue-200 text-blue-800 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                    disabled={selectedBooking.status === 'cancelled'}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedBooking.status === 'cancelled'
                        ? 'bg-red-200 text-red-800 cursor-not-allowed'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>

              {/* Booking Meta */}
              <div className="text-sm text-gray-500 mb-6">
                <p>Booking Created: {new Date(selectedBooking.created_at).toLocaleString('en-IN')}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDelete(selectedBooking.id)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                >
                  Delete Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
