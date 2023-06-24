const {logger} = require("../config/log4js/log4js");
const getDao = require("../dao/index");

const sockets = (server) =>  {

    const dao = getDao();
    
    const ioserver = require('socket.io')(server, {
        cors: {
            origin:"http://localhost:3000",
        }
    });
   
    ioserver.on ("connect", async (client) => {
        logger.info(`Cliente conectado con ID ${client.id}`);
        const messages = await dao.getAllMessages();
        client.emit("all-messages", messages);
        client.on("mensaje-del-cliente", async (message) => {
            await dao.addMessage(message);
            const allMessages = await dao.getAllMessages();
            ioserver.sockets.emit("all-messages", allMessages)
        });
    });

}

module.exports = sockets;
