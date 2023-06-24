const knex = require("knex");
const { logger } = require("../config/log4js/log4js");
const { v4: uuidv4 } = require('uuid');

const PGClient = knex({
    client: 'pg',
    connection: {
        host: process.env.POSTGRE_URI,
        user: process.env.POSTGRE_USER,
        password: process.env.POSTGRE_PASSWORD,
        database: "ecommerce_trxc",
        port: 5432,
        ssl: process.env.POSTGRE_SSL,
    }
})

class PostgreActions {
   
    connect = async () => {
       
        try {
            let exists = await PGClient.schema.hasTable("messages");
            if (!exists) {
                await PGClient.schema.createTable("messages", (table) => {
                    table.uuid('_id').primary();         //"primary()" Para que nose puedan insertar filas con misma id
                    table.string("username");
                    table.string("message");
                    table.string("date");
                });
            }   

            exists = await PGClient.schema.hasTable("users");
            if (!exists) {
                await PGClient.schema.createTable("users", (table) => {
                    table.uuid('_id').primary();         //"primary()" Para que nose puedan insertar filas con misma id
                    table.string("username");
                    table.string("password");
                    table.string("name");   
                    table.string("address");      
                    table.string("age");      
                    table.string("phone");     
                    table.string("filename");      
                    table.json("carrito");      
                    table.boolean("isadmin").defaultTo(false);
                });
            }   
               
            exists = await PGClient.schema.hasTable("orders");
            if (!exists) {
                await PGClient.schema.createTable("orders", (table) => {
                    table.uuid('_id').primary();         //"primary()" Para que nose puedan insertar filas con misma id
                    table.string("date");
                    table.string("username");   
                    table.string("name");      
                    table.string("address");      
                    table.string("phone");     
                    table.string("products");      
                    table.integer("total");      
                });
            }    

            exists = await PGClient.schema.hasTable("products");
            if (!exists) {
                await PGClient.schema.createTable("products", (table) => {
                    table.uuid('_id').primary();        //"primary()" Para que nose puedan insertar filas con misma id
                    table.string("id");
                    table.string("categoria");
                    table.string("marca");
                    table.string("modelo");   
                    table.integer("precio");      
                    table.string("imgScr");    
                    table.integer("stock");  
                    table.string("socket");     
                    table.string("frecuencia");   
                    table.string("tipodememoria");  
                    table.string("cantidaddememoria");  
                    table.string("tdp");  
                    table.string("serie");  
                    table.string("certificacion");     
                    table.string("potencia"); 
                    table.string("rgb"); 
                    table.json("opcionesBusqueda"); 
                    table.string("describir");       
                });
            }                
        } catch (err) {
            logger.error("Error al crear Tablas en Base de Datos Postgre", err.message);
        }  
    }

    uploadDB = async (data) => {
        try {
            const dataParse = data.map((producto) => {
                producto.opcionesBusqueda = JSON.stringify(producto.opcionesBusqueda);          //Pasamos dato de tipo array de objetos a json ya que postgre no acepta arrays
                producto._id = uuidv4();
                return producto;            
            })            
            await PGClient("products").where({}).del();
            await PGClient("products").insert(dataParse);
            return {success: true};
        } catch (err) {
            logger.error("Error al subir base de datos de productos", err.message);
            return false;
        }
    }

    getBDD = async () => {
        try {
            const productosDB = await PGClient.select("*").from("products");
            return productosDB;
        } catch (err) {
            logger.error("Error al obtener listado total de productos de la base de datos", err.message);
            return false;
        }
    }

    getProduct = async (id) => {
        try {
            const productoDB = await PGClient("products").where({_id: id});
            return productoDB[0];
        } catch (err) {
            logger.error("Id de producto no válido", err.message);
            return false;
        }
    }

    addOrder = async (orderData) => {
        try {
            orderData._id = uuidv4();
            await PGClient("orders").insert(orderData);    //Retorna un array
            return orderData;
        } catch (err) {
            logger.error("Error al guardar Orden de compra en la base de datos", err.message);
            return false;
        }
    }

    addUser = async (userData) => {
        try {
            userData._id = uuidv4();
            userData.carrito = JSON.stringify([]);
            await PGClient("users").insert(userData);
            return {success: true};
        } catch (err) {
            logger.error("Error al agregar usuario a la base de datos", err.message);
            return false;
        }
    }

    getUser = async (username) => {
        try {
            const userData = await PGClient("users").where({username: username});
            userData.carrito ? userData.carrito = JSON.parse(userData.carrito): userData.carrito = [];   //Si el carrito esta vacío userData.carrito es undefined (por ser un [] en json !?)
            return userData[0];
        } catch (err) {
            logger.error("Error al obtener datos de usuario de la base de datos", err.message);
            return false;
        }
    }

    saveCart = async (username, carrito) => {
        try {
            const carritoEnJSON = JSON.stringify(carrito);
            await PGClient("users").where({username: username}).update({carrito: carritoEnJSON})
            return {success: true};
        } catch (err) {
            logger.error("Error al guardar carrito en la base de datos", err.message);
            return false;
        }
    }

    deleteProduct = async (data) => {
        try {
            const id = data;
            const resp = await PGClient("products").where({_id: id}).del();         //Si se borra ok devuelve 1
            return resp ? {success: true} : false;
        } catch (err) {
            logger.error("Error al eliminar producto de la base de datos", err.message);
            return false;
        }
    } 

    modifyProduct = async (data) => {
        try {
            const {id, field, value} = data;
            const resp = await PGClient("products").where({_id: id}).update({ [field]: value });       //Si se modifica OK devuelve el producto, sino devuelve null
            return resp ? {success: true} : false;
        } catch (err) {
            logger.error("Error al actualizar producto la base de datos", err.message);
            return false;
        }
    }

    addProduct = async (data) => {
        try {
            data.opcionesBusqueda = JSON.stringify(data.opcionesBusqueda);          //Pasamos dato de tipo array de objetos a json ya que postgre no acepta arrays
            data._id = uuidv4();
            const resp = await PGClient("products").insert(data);
            return resp ? {success: true} : false;
        } catch (err) {
            logger.error("Error al agregar producto de la base de datos", err.message);
            return false;
        }
    } 

    getAllMessages = async () => {
        try {
            const messagesDB = await PGClient.select("*").from("messages");
            return messagesDB;
        } catch (err) {
            logger.error("Error al obtener el listado total de mensajes de la base de datos", err.message);
            return false;
        }
    }

    addMessage = async (message) => {
        try {
            message._id = uuidv4();
            const resp = await PGClient("messages").insert(message);
            return resp ? {success: true} : false;
        } catch (err) {
            logger.error("Error al agregar mensaje a la base de datos", err.message);
            return false;
        }
    } 

    clearCarts = async () => {
        try {
            await PGClient("users").where({}).update({carrito: JSON.stringify([])})
            return {success: true};
        } catch (err) {
            logger.error("Error al vaciar carritos en la base de datos", err.message);
            return false;
        }
    }
}

module.exports = PostgreActions;