'use strict';

const bcrypt = require('bcryptjs');
const pool = require('../db');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const personRepository = require('../repositories/personrepository');

const personAuthController = {
  //Function to login
  async login(req, res) {
    try {
        const { mail, password } = req.body;

        // Fetch user by email
        const user = await personRepository.findByMail(mail);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the hashed password stored in the retrieved user object
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If the credentials are valid, generate a JWT token
        const token = jwt.sign(
            { id: user.id, mail: user.mail },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the token in the response
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' || error.message });
    }
}
,

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
//se usa en funcion logout de manera exitosa
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
module.exports = personAuthController;