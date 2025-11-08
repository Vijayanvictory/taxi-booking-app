const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class Admin {
  // Find admin by username
  static async findByUsername(username) {
    const result = await pool.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );
    return result.rows[0];
  }

  // Verify admin password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Create new admin (optional - for future use)
  static async create(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, hashedPassword]
    );
    return result.rows[0];
  }
}

module.exports = Admin;
