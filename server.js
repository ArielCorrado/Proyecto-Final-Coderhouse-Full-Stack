require('dotenv').config();
const express = require("express"); 
require("./config/auth");
const mongoose = require ("mongoose");
mongoose.set('strictQuery', true);
const cluster = require("cluster");
const maxCPUs = require("os").cpus().length;                     //Da la cantidad de Hilos (No los nucleos del CPU)
const {logger} = require("./config/log4js/log4js");
const setApp = require("./config/app");
const getDao = require("./dao/index");
const dao = getDao();
const {mode, PORT} = require("./config/portmode");              //Ejemplos para iniciar app:  nodemon  //  node server.js  //  node server.js --port=8085 --mode=CLUSTER
const sockets = require ("./config/sockets");                   //                            forever start server.js --port=8080 --mode=FORK  //  nodemon -- --port=8081 --mode=FORK
        
const createServer = async () => {
    const app = express();
    setApp(app);
        
    await dao.connect()        
    const server = app.listen(PORT, logger.info(`Server corriendo en puerto ${PORT} Modo: ${mode}. Proceso ${process.pid}.`));
    sockets(server);
}

if (mode === "CLUSTER") { 

    if (cluster.isMaster)  {
        for (let i = 0; i < maxCPUs; i++) {
            cluster.fork();
        }

        cluster.on("exit", (worker, code, signal) => {
            cluster.fork();
        })
    } else {
        createServer();
    }    

} else if (mode === "FORK") {
    createServer();
} else {
    console.log("El Segundo Parámetro es Inválido. Ingresar FORK o CLUSTER"); 
}


