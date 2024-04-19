'use strict';

const bcrypt = require('bcryptjs');
const pool = require('../db');

const personController = {
  // Function to save a new person
  async savePerson(req, res) {
    try {
      const { name, lastname, mail, password } = req.body;

      // Check if the email already exists in the database
      const emailExists = await pool.query('SELECT * FROM person WHERE mail = $1', [mail]);

      if (emailExists.rows.length > 0) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Execute the query to insert the person's data into the database
      const query = 'INSERT INTO person (name, lastname, mail, password) VALUES ($1, $2, $3, $4)';
      const values = [name, lastname, mail, hashedPassword];

      await pool.query(query, values);

      // Send success response
      res.status(200).json({ message: 'Person saved successfully', requestBody: req.body });
    } catch (error) {
      console.error('Error saving person:', error);
      // Send error response
      res.status(500).json({ message: error.message || 'Error saving person' });
    }
  },

  // Function to fetch all persons from the database
  async getPerson(req, res) {
    try {
      // Execute SQL query to fetch all rows from the person table
      const results = await pool.query('SELECT * FROM person');
  
      // Send success response with the rows fetched from the database
      res.status(200).json(results.rows);
    } catch (error) {
      console.error('Error fetching persons:', error);
      // Send error response
      res.status(500).json({ message: 'Error fetching persons' });
    }
  },

  // Function to delete a specific person from the database
  async deletePerson(req, res) {
    try {
      const personId = req.params.id;
    
      // Execute SQL query to delete the person by ID
      await pool.query('DELETE FROM person WHERE id = $1', [personId]);
    
      // Send success response
      res.status(200).json({ message: 'Person deleted successfully', deletedId: personId });
    } catch (error) {
      console.error('Error deleting person:', error);
      // Send error response
      res.status(500).json({ message: 'Error deleting person' });
    }
  },

  // Function to update a specific person in the database
  async updatePerson(req, res) {
    try {
      const personId = req.params.id;
      const { name, lastname, mail, password } = req.body;

      // Build the SET clause for the SQL query dynamically based on the provided attributes
      let setClause = '';
      const values = [];
      
      if (name) {
        setClause += 'name = $1, ';
        values.push(name);
      }
      if (lastname) {
        setClause += 'lastname = $2, ';
        values.push(lastname);
      }
      if (mail) {
        setClause += 'mail = $3, ';
        values.push(mail);
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        setClause += 'password = $4, ';
        values.push(hashedPassword);
      }

      // Remove the trailing comma and space from the setClause
      setClause = setClause.slice(0, -2);

      // Add the personId to the values array
      values.push(personId);

      // Execute SQL query to update the person's data by ID
      const query = `UPDATE person SET ${setClause} WHERE id = $${values.length}`;
      await pool.query(query, values);

      // Send success response
      res.status(200).json({ message: 'Person updated successfully', updatedId: personId });
    } catch (error) {
      console.error('Error updating person:', error);
      // Send error response
      res.status(500).json({ message: 'Error updating person' });
    }
  }
};

module.exports = personController;
