const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authenticateAdmin = require('../middleware/auth');
const { validateVehicle, checkValidation } = require('../middleware/validation');

// Public routes
router.get('/', vehicleController.getAllVehicles);
router.get('/service/:serviceType', vehicleController.getVehiclesByServiceType);
router.get('/:id', vehicleController.getVehicleById);

// Admin routes
router.get('/admin/all', authenticateAdmin, vehicleController.getAllVehiclesForAdmin);
router.post('/', authenticateAdmin, validateVehicle, checkValidation, vehicleController.createVehicle);
router.put('/:id', authenticateAdmin, validateVehicle, checkValidation, vehicleController.updateVehicle);
router.patch('/:id/toggle-status', authenticateAdmin, vehicleController.toggleVehicleStatus);
router.delete('/:id', authenticateAdmin, vehicleController.deleteVehicle);

module.exports = router;
