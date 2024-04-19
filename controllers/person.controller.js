// In your personController.js file
'use strict';

const Person = require('../models/person');

const personController = {
  // Controller action to save a new person
  savePerson: async function(req, res) {
    try {
      const { name, lastname, mail, password } = req.body;

      // Check if person with the given email already exists
      const existingPerson = await Person.findOne({ mail });
      if (existingPerson) {
        return res.status(400).json({ message: 'Person with this email already exists' });
      }

      // Create a new person object and save it to the database
      const newPerson = new Person({
        name,
        lastname,
        mail,
        password
      });
      const savedPerson = await newPerson.save();

      return res.status(200).json({ message: 'Person saved successfully', person: savedPerson });
    } catch (error) {
      console.error('Error saving person:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
 
};

module.exports = personController;
