'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db'); // Import the pool instance from db.js

const app = express();
const port = 3700;



// Middleware to parse request body as JSON
app.use(bodyParser.json());

// Use the personRoute for handling person-related routes
const personRoute = require('./routes/person.route');
app.use('/', personRoute);

// Connect to the PostgreSQL database
pool.connect()
  .then(() => {
    console.log('Connected to the PostgreSQL database');
    // Once connected to the database, start the Express server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      // After server starts, execute query to get the first row from 'person' table
      pool.query('SELECT * FROM person LIMIT 1')
        .then(result => {
          console.log('First row of the person table:', result.rows[0]);
        })
        .catch(error => console.error('Error querying database:', error));
    });
  })
  .catch(err => console.error('Error connecting to the PostgreSQL database', err));

// Define routes and middleware for your Express application
// This will not be executed as the server starts after the database connection is established
// For example:
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Add more routes and middleware as needed
