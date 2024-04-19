'use strict'
var express = require('express');
var podyParser = require('body-parser');
const bodyParser = require('body-parser');
var app = express();
var sessions=require('express-session');
var cookieParser=require('cookie-parser');
//la creaci[on dura 24 horas en milisegundos]
const oneDay=1000*60*60*24;
//agregar a nuestro app el uso de sesiones
app.use(sessions({
    //es una clave que se genera randomicamente en tiempo de ejecucion cuando esta en produccion
    secret:"estaesmiclavesecretaf;ijeroifwerpfowurghwoifwek",
    //sirve para enviar cualquier sesion al almacen
    saveUninitialized:true,
    cookie:{maxAge:oneDay},
    //impide que la sesion se quede guardada aunque no se haya cambiado
    resave:false
}));
app.use(cookieParser());
module.exports=app;