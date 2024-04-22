'use strict';

const express = require('express');
const router = express.Router();
const personController = require('../controllers/person.controller');
const passport = require('passport');
//const passport =require ('../app').passport;


// Route to save a new person
router.post('/savePerson', personController.savePerson);
router.get('/getPerson', personController.getPerson);
router.delete('/deletePerson/:id', personController.deletePerson);
router.put('/updatePerson/:id', personController.updatePerson);

// Route to get authenticated user information
router.get('/profile', passport.authenticate('jwt', { session: false }), personController.getAuthenticatedUserInfo);
// Route for user login
router.post('/login', personController.login);
module.exports = router;