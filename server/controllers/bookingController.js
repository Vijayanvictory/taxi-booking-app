const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const { calculateFare } = require('../utils/helpers');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.getById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking'
    });
  }
};

exports.getBookingByReference = async (req, res) => {
  try {
    const booking = await Booking.getByReferenceId(req.params.referenceId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking'
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await Booking.getDashboardStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats'
    });
  }
};

exports.createBooking = async (req, res) => {
  try {
    // Verify vehicle exists
    const vehicle = await Vehicle.getById(req.body.vehicle_id);
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    // Create booking
    const booking = await Booking.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
      referenceId: booking.reference_id
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking'
    });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.updateStatus(req.params.id, status);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking status'
    });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.delete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully',
      data: booking
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete booking'
    });
  }
};

exports.calculateFareEstimate = async (req, res) => {
  try {
    const { vehicle_id, distance } = req.body;
    
    const vehicle = await Vehicle.getById(vehicle_id);
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    const fare = calculateFare(distance, vehicle.rate_per_km, vehicle.base_fare);

    res.json({
      success: true,
      data: {
        vehicle_id: vehicle.id,
        vehicle_name: vehicle.vehicle_name,
        distance,
        rate_per_km: vehicle.rate_per_km,
        base_fare: vehicle.base_fare,
        estimated_fare: fare
      }
    });
  } catch (error) {
    console.error('Calculate fare error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate fare'
    });
  }
};
