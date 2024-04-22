'use strict'
var express = require('express');
var podyParser = require('body-parser');
const bodyParser = require('body-parser');
var app = express();
var sessions=require('express-session');
var cookieParser=require('cookie-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');
require('dotenv').config();

var personRoutes=require('./routes/person.route');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use('/',personRoutes);

/////////////////session
// Cookie parser middleware
app.use(cookieParser());

// Session middleware
app.use(sessions({
    secret: process.env.JWT_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// JWT authentication strategy
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET // Use the JWT secret key from environment variables
}, (jwtPayload, done) => {
    // You can perform database operations here to validate the user based on the JWT payload
    // For simplicity, assuming the payload contains user information
    return done(null, jwtPayload);
}));

///////////////////////

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, X-Request-With, Content-Type,Accept, Access-Control-Allow, Request-Method')
    res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials',true);
    next();
});

//la creaci[on dura 24 horas en milisegundos]
const oneDay=1000*60*60*24;
//agregar a nuestro app el uso de sesiones
app.use(sessions({
    //es una clave que se genera randomicamente en tiempo de ejecucion cuando esta en produccion
    secret:"44aa275748be986d768ec9d300093aacbf4e410c2bfabafed4028d6b25434470",
    //sirve para enviar cualquier sesion al almacen
    saveUninitialized:true,
    cookie:{maxAge:oneDay},
    //impide que la sesion se quede guardada aunque no se haya cambiado
    resave:false
}));

module.exports = {
    app,
    passport
};