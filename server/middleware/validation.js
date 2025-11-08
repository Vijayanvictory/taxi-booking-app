const { body, validationResult } = require('express-validator');

// Validation rules for bookings
const validateBooking = [
  body('vehicle_id').isInt().withMessage('Valid vehicle ID is required'),
  body('service_type').isIn(['One-Way', 'Round Trip']).withMessage('Service type must be One-Way or Round Trip'),
  body('pickup_location').trim().notEmpty().withMessage('Pickup location is required').escape(),
  body('drop_location').trim().notEmpty().withMessage('Drop location is required').escape(),
  body('pickup_date').isDate().withMessage('Valid pickup date is required'),
  body('pickup_time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid pickup time is required (HH:MM)'),
  body('estimated_fare').isFloat({ min: 0 }).withMessage('Valid fare is required'),
  body('user_name').trim().notEmpty().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters').escape(),
  body('user_mobile').matches(/^[0-9]{10}$/).withMessage('Mobile number must be 10 digits'),
  body('user_email').optional().isEmail().withMessage('Invalid email format').normalizeEmail()
];

// Validation rules for vehicles
const validateVehicle = [
  body('vehicle_name').trim().notEmpty().isLength({ min: 2, max: 100 }).withMessage('Vehicle name is required').escape(),
  body('service_type').isIn(['One-Way', 'Round Trip', 'Both']).withMessage('Invalid service type'),
  body('rate_per_km').isFloat({ min: 0 }).withMessage('Rate per KM must be a positive number'),
  body('base_fare').isFloat({ min: 0 }).withMessage('Base fare must be a positive number'),
  body('vehicle_info').optional().trim().escape(),
  body('image_url').optional().isURL().withMessage('Invalid image URL'),
  body('status').optional().isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive')
];

// Validation rules for admin login
const validateLogin = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Middleware to check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }
  next();
};

module.exports = {
  validateBooking,
  validateVehicle,
  validateLogin,
  checkValidation
};
