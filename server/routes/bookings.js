const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authenticateAdmin = require('../middleware/auth');
const { validateBooking, checkValidation } = require('../middleware/validation');

// Public routes
router.post('/', validateBooking, checkValidation, bookingController.createBooking);
router.get('/reference/:referenceId', bookingController.getBookingByReference);
router.post('/calculate-fare', bookingController.calculateFareEstimate);

// Admin routes
router.get('/', authenticateAdmin, bookingController.getAllBookings);
router.get('/dashboard/stats', authenticateAdmin, bookingController.getDashboardStats);
router.get('/:id', authenticateAdmin, bookingController.getBookingById);
router.patch('/:id/status', authenticateAdmin, bookingController.updateBookingStatus);
router.delete('/:id', authenticateAdmin, bookingController.deleteBooking);

module.exports = router;
