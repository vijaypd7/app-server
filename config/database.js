const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // acquireTimeout: 60000,
  // timeout: 60000,
  // reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);


module.exports = {
  pool,
};
