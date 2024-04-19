'use strict';

const express = require('express');
const router = express.Router();
const personController = require('../controllers/person.controller');

// Route to save a new person
router.post('/savePerson', personController.savePerson);
router.get('/getPerson', personController.getPerson);
module.exports = router;