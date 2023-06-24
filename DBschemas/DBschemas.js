const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema ({
    username: String,
    message: String,
    date: String
})

const messagesMongo = mongoose.model("messages", messagesSchema);

const usersSchema = new Schema ({
    username: String,
    password: String,
    name: String,
    address: String,
    age: String,
    phone: String,
    filename: String,
    carrito: Array,
    isadmin: {type: Boolean, default: false}
})

const usersMongo = mongoose.model("users", usersSchema);

const productsSchema = new Schema ({
    categoria: String,
    marca: String,
    modelo: String,
    precio: Number,
    imgScr: String,
    stock: Number,
    socket: String,
    frecuencia: String,
    tipodememoria: String,
    cantidaddememoria: String,
    tdp: String,
    serie: String,
    certificacion: String,
    potencia: String,
    rgb: String,
    opcionesBusqueda: Array,
    describir: String
})

const productsMongo = mongoose.model("products", productsSchema);

const ordersSchema = new Schema ({
    date: String,
    username: String,
    name: String,
    address: String,
    phone: String,
    products: String,
    total: Number
})

const ordersMongo = mongoose.model("orders", ordersSchema);


module.exports = {usersMongo, productsMongo, ordersMongo, messagesMongo}
