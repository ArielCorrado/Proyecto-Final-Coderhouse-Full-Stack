const postgreActions = require("./postgreActions");
const mongoActions = require("./mongoActions");

let dao;

const getDao = () => {
    
    if (!dao) {
        dao = process.env.PERSISTENCE === "mongo" ? new mongoActions() : new postgreActions();
    }
    return dao;

}

module.exports = getDao;
