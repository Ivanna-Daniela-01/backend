// In your person.js file in the models folder
'use strict';

// Define your model
const Person = {
  id: { type: 'serial', primaryKey: true },
  name: { type: 'varchar(50)' },
  lastname: { type: 'varchar(50)' },
  mail: { type: 'varchar(100)' },
  password: { type: 'varchar(50)' }
};

// Export your model
module.exports = Person;
