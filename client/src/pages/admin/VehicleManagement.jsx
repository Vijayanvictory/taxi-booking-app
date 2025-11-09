import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleAPI } from '../../services/api';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

const VehicleManagement = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    id: null,
    vehicle_name: '',
    service_type: 'One-Way',
    rate_per_km: '',
    base_fare: '',
    vehicle_info: '',
    image_url: '',
    status: 'Active',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchVehicles();
  }, [navigate]);

  const fetchVehicles = async () => {
    try {
      const response = await vehicleAPI.getAllForAdmin();
      setVehicles(response.data.data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData({ ...formData, image_url: imageUrl });
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const openAddModal = () => {
    setFormData({
      id: null,
      vehicle_name: '',
      service_type: 'One-Way',
      rate_per_km: '',
      base_fare: '',
      vehicle_info: '',
      image_url: '',
      status: 'Active',
    });
    setImagePreview('');
    setEditMode(false);
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const openEditModal = (vehicle) => {
    setFormData({
      id: vehicle.id,
      vehicle_name: vehicle.vehicle_name,
      service_type: vehicle.service_type,
      rate_per_km: vehicle.rate_per_km,
      base_fare: vehicle.base_fare,
      vehicle_info: vehicle.vehicle_info || '',
      image_url: vehicle.image_url || '',
      status: vehicle.status,
    });
    setImagePreview(vehicle.image_url || '');
    setEditMode(true);
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      id: null,
      vehicle_name: '',
      service_type: 'One-Way',
      rate_per_km: '',
      base_fare: '',
      vehicle_info: '',
      image_url: '',
      status: 'Active',
    });
    setImagePreview('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        vehicle_name: formData.vehicle_name,
        service_type: formData.service_type,
        rate_per_km: parseFloat(formData.rate_per_km),
        base_fare: parseFloat(formData.base_fare),
        vehicle_info: formData.vehicle_info,
        image_url: formData.image_url,
        status: formData.status,
      };

      if (editMode) {
        await vehicleAPI.update(formData.id, payload);
        setSuccess('Vehicle updated successfully!');
      } else {
        await vehicleAPI.create(payload);
        setSuccess('Vehicle added successfully!');
      }

      fetchVehicles();
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Failed to save vehicle');
      console.error('Save error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      await vehicleAPI.delete(id);
      setSuccess('Vehicle deleted successfully!');
      fetchVehicles();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete vehicle');
      console.error('Delete error:', err);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await vehicleAPI.toggleStatus(id);
      fetchVehicles();
    } catch (err) {
      setError('Failed to toggle status');
      console.error('Toggle error:', err);
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
            <button className="px-4 py-3 font-semibold text-blue-600 border-b-2 border-blue-600">
              Vehicles
            </button>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="px-4 py-3 text-gray-600 hover:text-blue-600"
            >
              Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Vehicle Management</h2>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            + Add New Vehicle
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {error && !showModal && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Vehicles Grid */}
        {vehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No vehicles found</p>
            <button
              onClick={openAddModal}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Vehicle Image */}
                <div className="relative">
                  <img
                    src={vehicle.image_url || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={vehicle.vehicle_name}
                    className="w-full h-48 object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      vehicle.status === 'Active'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </div>

                {/* Vehicle Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {vehicle.vehicle_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {vehicle.vehicle_info || 'No description'}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-semibold">{vehicle.service_type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rate/km:</span>
                      <span className="font-semibold">₹{vehicle.rate_per_km}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base Fare:</span>
                      <span className="font-semibold">₹{vehicle.base_fare}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(vehicle)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(vehicle.id)}
                      className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-semibold"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {editMode ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h3>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Vehicle Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Name *
                  </label>
                  <input
                    type="text"
                    name="vehicle_name"
                    value={formData.vehicle_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Sedan, SUV, Hatchback"
                    required
                  />
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="One-Way">One-Way</option>
                    <option value="Round Trip">Round Trip</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                {/* Rate Per KM and Base Fare */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate per KM (₹) *
                    </label>
                    <input
                      type="number"
                      name="rate_per_km"
                      value={formData.rate_per_km}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="12.50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Fare (₹) *
                    </label>
                    <input
                      type="number"
                      name="base_fare"
                      value={formData.base_fare}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="50.00"
                      required
                    />
                  </div>
                </div>

                {/* Vehicle Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Description
                  </label>
                  <textarea
                    name="vehicle_info"
                    value={formData.vehicle_info}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Comfortable 4-seater, AC, etc."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={uploadingImage}
                  />
                  {uploadingImage && (
                    <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
                  )}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-3 w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={uploadingImage}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editMode ? 'Update Vehicle' : 'Add Vehicle'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
