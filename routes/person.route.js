'use strict';

const express = require('express');
const router = express.Router();
const personController = require('../controllers/person.controller');

// Route to save a new person
router.post('/savePerson', personController.savePerson);
router.get('/getPerson', personController.getPerson);
router.delete('/deletePerson/:id', personController.deletePerson);
module.exports = router;