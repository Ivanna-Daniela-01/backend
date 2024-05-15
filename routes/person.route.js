'use strict';

const express = require('express');
const router = express.Router();
const personController = require('../controllers/person.controller');
const personAuthController= require('../controllers/person.auth.controller');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//const passport =require ('../app').passport;


// Route to save a new person
router.post('/savePerson', personController.savePerson);
router.get('/getPerson', personController.getPerson);
router.delete('/deletePerson/:id', personController.deletePerson);
router.put('/updatePerson/:id', personController.updatePerson);

// Route to get authenticated user information
//router.get('/profile', passport.authenticate('jwt', { session: false }), personController.getAuthenticatedUserInfo);
// Route for user login
router.post('/login', personAuthController.login);
//rOUTE TO USER LOGOUT
router.get('/logout', personAuthController.logout);

router.get('/perfil', passport.authenticate('jwt', { session: false }), personAuthController.obtenerPerfil);


function verifyToken(req, res, next) {
    if (!req.headers.authorization){
        return res.status(401).send('Unauthorize Request');
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token == 'null'){
        return res.status(401).send('Unauthorize Request');
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload._id;
    next();
}

router.get('/profile', verifyToken, (req, res)=>{
    res.send(req.userId);
});

module.exports = router;