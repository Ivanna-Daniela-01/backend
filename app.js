'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const pool = require('../db');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const personRoutes = require('./routes/person.route');
require('dotenv').config();

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cookie parser middleware
app.use(cookieParser());

// Session middleware
app.use(session({
    secret: process.env.JWT_SECRET, // Use a secret key for session
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
        // Perform database lookup to find the user based on the JWT payload
        const user = await pool.query('SELECT id, mail FROM person WHERE id = $1', [jwtPayload.id]);

        if (user.rows.length === 0) {
            return done(null, false);
        }

        // User found, return the user object
        return done(null, user.rows[0]);
    } catch (error) {
        return done(error, false);
    }
}));

// Routes
app.use('/', personRoutes);

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, X-Request-With, Content-Type, Accept, Access-Control-Allow, Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

module.exports = app;
