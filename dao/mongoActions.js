const { logger } = require("../config/log4js/log4js");
const {usersMongo, productsMongo, ordersMongo, messagesMongo} = require("../DBschemas/DBschemas");
const mongoose = require("mongoose");

class MongoActions {

    connect = async () => {
        mongoose.connect(process.env.MONGO_URI, {dbName: "ecommerce"});
    }
    
    uploadDB = async (data) => {
        try {
            await productsMongo.deleteMany({});
            await productsMongo.insertMany(data);
            return {success: true};
        } catch (err) {
            logger.error("Error al subir base de datos de productos", err.message);
            return false;
        }
    }

    getBDD = async () => {
        try {
            const productosDB = await productsMongo.find({});
            return productosDB;
        } catch (err) {
            logger.error("Error al obtener listado total de productos de la base de datos", err.message);
            return false;
        }
    }

    getProduct = async (id) => {
        try {
            const productoDB = await productsMongo.findById(id);
            return productoDB;
        } catch (err) {
            logger.error("Id de producto no válido", err.message);
            return false;
        }
    }

    addOrder = async (orderData) => {
        try {
            const order = await ordersMongo.insertMany(orderData);    //Retorna un array
            return order[0];
        } catch (err) {
            logger.error("Error al guardar Orden de compra en la base de datos", err.message);
            return false;
        }
    }

    addUser = async (userData) => {
        try {
            await usersMongo.insertMany(userData);
            return {success: true};
        } catch (err) {
            logger.error("Error al agregar usuario a la base de datos", err.message);
            return false;
        }
    }

    getUser = async (username) => {
        try {
            const userData = await usersMongo.findOne({ username: username });
            return userData;
        } catch (err) {
            logger.error("Error al obtener datos de usuario de la base de datos", err.message);
            return false;
        }
    }

    saveCart = async (username, carrito) => {
        try {
            await usersMongo.findOneAndUpdate({ username: username }, { carrito: carrito });
            return {success: true};
        } catch (err) {
            logger.error("Error al guardar carrito en la base de datos", err.message);
            return false;
        }
    }

    clearCarts = async () => {
        try {
            await usersMongo.updateMany({}, { carrito: [] });
            return {success: true};
        } catch (err) {
            logger.error("Error al vaciar carritos de la base de datos", err.message);
            return false;
        }
    }

    modifyProduct = async (data) => {
        try {
            const {id, field, value} = data;
            const resp = await productsMongo.findByIdAndUpdate(id, {[field]: value});       //Si se modifica OK devuelve el producto, sino devuelve null
            return resp ? {success: true} : false;
        } catch (err) {
            logger.error("Error al actualizar producto la base de datos", err.message);
            return false;
        }
    }

    deleteProduct = async (data) => {
        try {
            const id = data;
            const resp = await productsMongo.findByIdAndRemove(id);
            return resp ? {success: true} : false;
        } catch (err) {
            logger.error("Error al eliminar producto de la base de datos", err.message);
            return false;
        }
    } 

    addProduct = async (data) => {
        try {
            const resp = await productsMongo.insertMany(data);
            return resp ? {success: true} : false;
        } catch (err) {
            logger.error("Error al agregar producto de la base de datos", err.message);
            return false;
        }
    } 

    getAllMessages = async () => {
        try {
            const messagesDB = await messagesMongo.find({});
            return messagesDB;
        } catch (err) {
            logger.error("Error al obtener el listado total de mensajes", err.message);
            return false;
        }
    }

    addMessage = async (message) => {
        try {
            const resp = await messagesMongo.insertMany(message);
            return resp ? {success: true} : false;
        } catch (err) {
            logger.error("Error al agregar mensaje a la base de datos", err.message);
            return false;
        }
    } 

}    

module.exports = MongoActions;