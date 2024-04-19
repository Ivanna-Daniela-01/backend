'use strict';

const { Pool } = require('pg');
const express = require('express');
const app = express();
const port = 3700;

// Create a new Pool instance to handle PostgreSQL connections
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Users',
  password: 'abc123',
  port: 5432, // Default PostgreSQL port
});

// Connect to the PostgreSQL database
pool.connect()
  .then(() => {
    console.log('Connected to the PostgreSQL database');
    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      // Once server is started, execute query to get first row from 'person' table
      pool.query('SELECT * FROM person LIMIT 1')
        .then(result => {
          console.log('First row of the person table:', result.rows[0]);
        })
        .catch(error => console.error('Error querying database:', error));
    });
  })
  .catch(err => console.error('Error connecting to the PostgreSQL database', err));

// Define routes and middleware for your Express application
// For example:
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Add more routes and middleware as needed
