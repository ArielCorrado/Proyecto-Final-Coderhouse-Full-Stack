const express = require("express");
const passport = require("passport");
const session = require("express-session");
const {DBSessionsStore} = require("./storeDBSessions");
const cors = require("cors");
const path = require("path");
const {logger} = require("./log4js/log4js");
const engine = require("express-handlebars").engine;
const routes = require("../routes/routes")
const routesControl = require("../config/routesControl");

const setApp = (app) => {

    app.use(express.static(path.resolve(__dirname,"../public/build")));
    app.use(express.static(path.resolve(__dirname,"../public/avatars")));
    app.use(express.static(path.resolve(__dirname,"../public/styles")));
    app.use(express.static(path.resolve(__dirname,"../public")));
    app.use(cors({origin:"http://localhost:3000", credentials: true}));
    app.use(express.json());
    
    app.use(session({ 
        store: DBSessionsStore,
        secret: 'secret12021407', 
        resave: true, 
        saveUninitialized: true, 
        cookie: {maxAge: process.env.SESSION_EXPIRATION_TIME * 60 * 1000}      //Tiempo de expiración de sesión en milisegundos
    }));
    app.use(passport.initialize());
    app.use(passport.session());
                    
    app.set("view engine", "pug");
    app.set("view engine", "handlebars");
    app.set("view engine", "ejs");
    app.set("views", "./views"); 

    app.engine("handlebars", engine());

    app.use((req, res, next) => {
        logger.info(`Acceso a Ruta: ${req.url} - Método: ${req.method}`);
        next();
    })
    
    app.use("/api", routes);   
    routesControl(app);

    app.use((err, req, res, next) => {              //Middleware para manejo del error de usuario existente en signup
        const status = err.status || 500;
        const message = err.message || "Error en el servidor.";
        res.status(status).json({error: message});
    });
}    

module.exports = setApp;