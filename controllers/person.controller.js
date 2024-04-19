// In your personController.js file
'use strict';

const Person = require('../models/person');
'use strict';

const { Pool } = require('pg');

// Create a new Pool instance to handle PostgreSQL connections
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Users',
  password: 'abc123',
  port: 5432, // Default PostgreSQL port
});

// Controller function to save a new person
async function savePerson(req, res) {
  try {
    const { name, lastname, mail, password } = req.body;

    // Execute SQL query to insert the person's data into the database
    const query = 'INSERT INTO person (name, lastname, mail, password) VALUES ($1, $2, $3, $4)';
    const values = [name, lastname, mail, password];
    await pool.query(query, values);

    // Send success response
    res.status(200).json({ message: 'Person saved successfully' });
  } catch (error) {
    console.error('Error saving person:', error);
    // Send error response
    res.status(500).json({ message: 'Error saving person' });
  }
}

module.exports = { savePerson };
