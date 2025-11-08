const pool = require('../config/db');

class Vehicle {
  // Get all active vehicles
  static async getAll() {
    const result = await pool.query(
      'SELECT * FROM vehicles WHERE status = $1 ORDER BY created_at DESC',
      ['Active']
    );
    return result.rows;
  }

  // Get all vehicles (admin)
  static async getAllForAdmin() {
    const result = await pool.query(
      'SELECT * FROM vehicles ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Get vehicle by ID
  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM vehicles WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Get vehicles by service type
  static async getByServiceType(serviceType) {
    const result = await pool.query(
      'SELECT * FROM vehicles WHERE service_type = $1 AND status = $2 ORDER BY rate_per_km ASC',
      [serviceType, 'Active']
    );
    return result.rows;
  }

  // Create new vehicle
  static async create(vehicleData) {
    const { vehicle_name, service_type, rate_per_km, base_fare, image_url, vehicle_info, status } = vehicleData;
    
    const result = await pool.query(
      `INSERT INTO vehicles 
       (vehicle_name, service_type, rate_per_km, base_fare, image_url, vehicle_info, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [vehicle_name, service_type, rate_per_km, base_fare, image_url || null, vehicle_info || null, status || 'Active']
    );
    return result.rows[0];
  }

  // Update vehicle
  static async update(id, vehicleData) {
    const { vehicle_name, service_type, rate_per_km, base_fare, image_url, vehicle_info, status } = vehicleData;
    
    const result = await pool.query(
      `UPDATE vehicles 
       SET vehicle_name = $1, service_type = $2, rate_per_km = $3, 
           base_fare = $4, image_url = $5, vehicle_info = $6, 
           status = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [vehicle_name, service_type, rate_per_km, base_fare, image_url, vehicle_info, status, id]
    );
    return result.rows[0];
  }

  // Delete vehicle
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM vehicles WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  // Toggle vehicle status
  static async toggleStatus(id) {
    const result = await pool.query(
      `UPDATE vehicles 
       SET status = CASE WHEN status = 'Active' THEN 'Inactive' ELSE 'Active' END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Vehicle;
