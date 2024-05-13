const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const personRepository = {
  async savePerson(name, lastname, mail, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO person (name, lastname, mail, password) VALUES ($1, $2, $3, $4) RETURNING *';
      const values = [name, lastname, mail, hashedPassword];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error saving person: ' + error.message);
    }
  },

  async getAllPersons() {
    try {
      const query = 'SELECT * FROM person';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Error fetching all persons: ' + error.message);
    }
  },
  

  async deletePerson(id) {
    try {
      const query = 'DELETE FROM person WHERE id = $1';
      await pool.query(query, [id]);
      return { message: 'Person deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting person: ' + error.message);
    }
  },

  async updatePerson(id, name, lastname, mail, password) {
    try {
      // Construct update query dynamically
      let updateClause = '';
      const values = [];
      
      if (name) {
        updateClause += 'name = $1, ';
        values.push(name);
      }
      // Add other fields as needed
      
      values.push(id);
      const query = `UPDATE person SET ${updateClause.slice(0, -2)} WHERE id = $${values.length}`;
      
      await pool.query(query, values);
      return { message: 'Person updated successfully' };
    } catch (error) {
      throw new Error('Error updating person: ' + error.message);
    }
  },

  async findByMail(mail) {
    try {
      const query = 'SELECT * FROM person WHERE mail = $1';
      const result = await pool.query(query, [mail]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error fetching person by email: ' + error.message);
    }
  }
};

module.exports = personRepository;
