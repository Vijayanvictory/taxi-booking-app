const pool = require('../config/db');
const { generateReferenceId } = require('../utils/helpers');

class Booking {
  // Get all bookings
  static async getAll() {
    const result = await pool.query(
      `SELECT b.*, v.vehicle_name, v.image_url as vehicle_image
       FROM bookings b
       LEFT JOIN vehicles v ON b.vehicle_id = v.id
       ORDER BY b.created_at DESC`
    );
    return result.rows;
  }

  // Get booking by ID
  static async getById(id) {
    const result = await pool.query(
      `SELECT b.*, v.vehicle_name, v.image_url as vehicle_image
       FROM bookings b
       LEFT JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Get booking by reference ID
  static async getByReferenceId(referenceId) {
    const result = await pool.query(
      `SELECT b.*, v.vehicle_name, v.image_url as vehicle_image
       FROM bookings b
       LEFT JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.reference_id = $1`,
      [referenceId]
    );
    return result.rows[0];
  }

  // Get today's bookings count
  static async getTodayCount() {
    const result = await pool.query(
      `SELECT COUNT(*) as count 
       FROM bookings 
       WHERE DATE(created_at) = CURRENT_DATE`
    );
    return parseInt(result.rows[0].count);
  }

  // Get total bookings count
  static async getTotalCount() {
    const result = await pool.query('SELECT COUNT(*) as count FROM bookings');
    return parseInt(result.rows[0].count);
  }

  // Get bookings by date range
  static async getByDateRange(startDate, endDate) {
    const result = await pool.query(
      `SELECT b.*, v.vehicle_name
       FROM bookings b
       LEFT JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.pickup_date BETWEEN $1 AND $2
       ORDER BY b.pickup_date DESC, b.pickup_time DESC`,
      [startDate, endDate]
    );
    return result.rows;
  }

  // Create new booking
  static async create(bookingData) {
    const {
      vehicle_id,
      service_type,
      pickup_location,
      drop_location,
      pickup_date,
      pickup_time,
      distance,
      estimated_fare,
      user_name,
      user_mobile,
      user_email
    } = bookingData;

    const referenceId = generateReferenceId();

    const result = await pool.query(
      `INSERT INTO bookings 
       (vehicle_id, service_type, pickup_location, drop_location, 
        pickup_date, pickup_time, distance, estimated_fare, 
        user_name, user_mobile, user_email, reference_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        vehicle_id,
        service_type,
        pickup_location,
        drop_location,
        pickup_date,
        pickup_time,
        distance || null,
        estimated_fare,
        user_name,
        user_mobile,
        user_email || null,
        referenceId,
        'pending'
      ]
    );
    return result.rows[0];
  }

  // Update booking status
  static async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  // Delete booking
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM bookings WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  // Get dashboard stats
  static async getDashboardStats() {
    const todayCount = await this.getTodayCount();
    const totalCount = await this.getTotalCount();
    
    const recentBookings = await pool.query(
      `SELECT b.*, v.vehicle_name
       FROM bookings b
       LEFT JOIN vehicles v ON b.vehicle_id = v.id
       ORDER BY b.created_at DESC
       LIMIT 5`
    );

    return {
      todayCount,
      totalCount,
      recentBookings: recentBookings.rows
    };
  }
}

module.exports = Booking;
