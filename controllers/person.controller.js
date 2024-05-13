'use strict';

const bcrypt = require('bcryptjs');
const pool = require('../db');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const personRepository = require('../repositories/personrepository');


const personController = {
  // Function to save a new person
  async savePerson(req, res) {
    try {
      const { name, lastname, mail, password } = req.body;
      const person = await personRepository.savePerson(name, lastname, mail, password);
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
      const persons = await personRepository.getAllPersons();
      res.status(200).json(persons);
    } catch (error) {
      console.error('Error fetching persons:', error);
      res.status(500).json({ message: 'Error fetching persons' || error.message });
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
  },

  //Function to login
  async login(req, res) {
    try {
        const { mail, password } = req.body;

        // Check if the user with the provided email exists in the database
        const user = await pool.query('SELECT * FROM person WHERE mail = $1', [mail]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = user.rows[0];

        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If the credentials are valid, generate a JWT token
        const token = jwt.sign(
            { id: userData.id, mail: userData.mail },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the token in the response
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' || error.message });
    }
},

// FunctionTOLOGOUT
async logout(req, res) {
  try {
      // Obtener el correo electrónico del usuario desde el token JWT
      //const userEmail = req.user.mail;

      // Destruir la sesión del usuario
      req.session.destroy();
      //req.logout();

      // Imprimir un mensaje de despedida en la consola
      //console.log(`Adiós ${userEmail}, has cerrado sesión exitosamente.`);

      // Enviar una respuesta al cliente
      res.status(200).json({ message: `Adiós , has cerrado sesión exitosamente.` });
  } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ message: error.message || 'Error logging out' });
  }
},

async obtenerPerfil(req, res) {
  try {
    // Verify if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get the user ID from the authenticated user data
    const userId = req.user.id;

    // Query the database to get the user's name
    const user = await pool.query('SELECT name FROM person WHERE id = $1', [userId]);

    // Check if the user was found
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract the user's name from the query results
    const userName = user.rows[0].name;

    // Send the response with the user's name
    res.status(200).json({ userName });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: error.message || 'Error fetching user profile' });
  }
}

};

module.exports = personController;
