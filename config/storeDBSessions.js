const MongoStore = require('connect-mongo');
const session = require("express-session");

let DBSessionsStore;

process.env.PERSISTENCE === "mongo" ? 
DBSessionsStore = MongoStore.create({ mongoUrl: process.env.MONGO_URI, dbName: "ecommerce"}) :
DBSessionsStore = new (require('connect-pg-simple')(session))({
    conString: `postgres://${process.env.POSTGRE_USER}:${process.env.POSTGRE_PASSWORD}@${process.env.POSTGRE_URI}:5432/ecommerce_trxc?ssl=${process.env.POSTGRE_SSL}`,
    createTableIfMissing: "sessions",
}), 

module.exports = {DBSessionsStore};
