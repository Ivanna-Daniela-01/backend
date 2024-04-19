'use strict'
var express = require('express');
var podyParser = require('body-parser');
const bodyParser = require('body-parser');
var app = express();
var sessions=require('express-session');
var cookieParser=require('cookie-parser');
var personRoutes=require('./routes/person.route');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


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
    secret:"estaesmiclavesecretaf;ijeroifwerpfowurghwoifwek",
    //sirve para enviar cualquier sesion al almacen
    saveUninitialized:true,
    cookie:{maxAge:oneDay},
    //impide que la sesion se quede guardada aunque no se haya cambiado
    resave:false
}));
app.use(cookieParser());
app.use('/',personRoutes);
module.exports=app;