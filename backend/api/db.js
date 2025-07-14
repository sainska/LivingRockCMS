// Database connection utility for Postgres
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/livingrockcms',
  // You can add more config options here
});

module.exports = pool; 