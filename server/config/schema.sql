-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(100) NOT NULL,
  service_type VARCHAR(50) NOT NULL,
  rate_per_km DECIMAL(10, 2) NOT NULL,
  base_fare DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  vehicle_info TEXT,
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
  service_type VARCHAR(50) NOT NULL,
  pickup_location VARCHAR(255) NOT NULL,
  drop_location VARCHAR(255) NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  distance DECIMAL(10, 2),
  estimated_fare DECIMAL(10, 2) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  user_mobile VARCHAR(20) NOT NULL,
  user_email VARCHAR(100),
  reference_id VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(pickup_date);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(reference_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
