'use strict';

const express = require('express');
const router = express.Router();
const personController = require('../controllers/person.controller');

// Route to save a new person
router.post('/savePerson', personController.savePerson);
module.exports = router;