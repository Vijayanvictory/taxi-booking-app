const pool = require('./db');
const fs = require('fs');
const path = require('path');

const initDatabase = async () => {
  try {
    console.log('📦 Initializing database...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await pool.query(schema);
    
    console.log('✅ Database tables created successfully');
    
    // Create default admin account
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.query(
      `INSERT INTO admins (username, password_hash) 
       VALUES ($1, $2) 
       ON CONFLICT (username) DO NOTHING`,
      ['admin', hashedPassword]
    );
    
    console.log('✅ Default admin account created (username: admin, password: admin123)');
    console.log('🎉 Database initialization complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();
