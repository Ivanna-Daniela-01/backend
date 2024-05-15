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
      await personRepository.deletePerson(personId);
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

        // Construct an object with the updated fields
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (lastname) updatedFields.lastname = lastname;
        if (mail) updatedFields.mail = mail;
        if (password) updatedFields.password = password;

        // Update the person entity using the repository method
        await personRepository.updatePerson(personId, updatedFields);

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
