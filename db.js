// db.js
const { Pool } = require('pg');
// app.js or server.js
require('dotenv').config();


// Create a new Pool instance to handle PostgreSQL connections
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
