// In your personController.js file
'use strict';

const Person = require('../models/person');

'use strict';

const pool = require('../db');

// Controller functions for handling person-related operations
const personController = {
  // Function to save a new person
  async savePerson(req, res) {
    const { name, lastname, mail, password } = req.body;

    // Execute SQL query to insert the person's data into the database
    const query = 'INSERT INTO person (name, lastname, mail, password) VALUES ($1, $2, $3, $4)';
    const values = [name, lastname, mail, password];
  
    pool.query(query, values)
      .then(() => {
        // Send success response
        res.status(200).json({ message: 'Person saved successfully', requestBody: req.body });
      })
      .catch(error => {
        console.error('Error saving person:', error);
        // Send error response
        res.status(500).json({ message: 'Error saving person' });
      });
  },

  // Function to fetch all persons from the database
  async getPerson(req, res) {
    try {
      // Execute SQL query to fetch all rows from the person table
      const results = await pool.query("SELECT * FROM person");
  
      // Send success response with the rows fetched from the database
      res.status(200).json(results.rows);
    } catch (error) {
      console.error('Error fetching person:', error);
      // Send error response
      res.status(500).json({ message: 'Error fetching person' });
    }
  }
};

module.exports = personController;
