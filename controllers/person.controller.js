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

    // Check if the email already exists in the database
    pool.query('SELECT * FROM person WHERE mail = $1', [mail])
      .then(result => {
        if (result.rows.length > 0) {
          // If email already exists, send a message indicating that the user is already in the database
          res.status(400).json({ message: 'User with this email already exists' });
        } else {
          // If email doesn't exist, execute the query to insert the person's data into the database
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
        }
      })
      .catch(error => {
        console.error('Error checking email existence:', error);
        // Send error response
        res.status(500).json({ message: 'Error checking email existence' });
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
  },

   // Function to delete an specific person from the database
  async deletePerson(req, res){
    try {
        const personId = req.params.id;
    
        // Execute SQL query to delete the person by ID
        const query = 'DELETE FROM person WHERE id = $1';
        const values = [personId];
        await pool.query(query, values);
    
        // Send success response
        res.status(200).json({ message: 'Person deleted successfully', deletedId: personId });
      } catch (error) {
        console.error('Error deleting person:', error);
        // Send error response
        res.status(500).json({ message: 'Error deleting person' });
      }
  },
  async updatePerson(req,res){
    try {
        const personId = req.params.id;
        const { name, lastname, mail, password } = req.body;
    
        // Build the SET clause for the SQL query dynamically based on the provided attributes
        let setClause = '';
        let values = [];
        let index = 1;
    
        if (name) {
          setClause += `name = $${index}, `;
          values.push(name);
          index++;
        }
        if (lastname) {
          setClause += `lastname = $${index}, `;
          values.push(lastname);
          index++;
        }
        if (mail) {
          setClause += `mail = $${index}, `;
          values.push(mail);
          index++;
        }
        if (password) {
          setClause += `password = $${index}, `;
          values.push(password);
          index++;
        }
    
        // Remove the trailing comma and space from the setClause
        setClause = setClause.slice(0, -2);
    
        // Execute SQL query to update the person's data by ID
        const query = `UPDATE person SET ${setClause} WHERE id = $${index}`;
        values.push(personId);
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
