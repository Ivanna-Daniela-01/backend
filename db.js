// db.js
const { Pool } = require('pg');

// Create a new Pool instance to handle PostgreSQL connections
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Users',
  password: 'abc123',
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
