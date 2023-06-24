const bcrypt = require ("bcryptjs");
const maxCPUs = require("os").cpus().length;
const sendMailToAdmin = require("../config/nodemailer");
const {sendSMS, sendWhatSapp} = require("../config/twilio");        //sendWhatSapp no implementado ya que el servicio es pago
const {mode, PORT, PORTFILES} = require("../config/portmode");
const getDao = require("../dao/index");
const dao = getDao();

exports.logData = (req) => {
    const username = req.user.username;
    const url_avatar = `${req.protocol}://${req.hostname}${PORTFILES}/${req.user.filename}`;
    const carrito = req.user.carrito;
    const isadmin = req.user.isadmin;
    return({username: username, url_avatar: url_avatar, carrito: carrito, isadmin: isadmin});
}

exports.signup = async (req) => {
    const userData = req.body;
    if(!req.body.filename) userData.filename = "default_avatar.png";
    const url_avatar = req.body.filename ? `${req.protocol}://${req.hostname}${PORTFILES}/${req.body.filename}` : `${req.protocol}://${req.hostname}${PORTFILES}/default_avatar.png`;
            
    const salt = bcrypt.genSaltSync(10);
    userData.password = bcrypt.hashSync(req.body.password, salt);
    await dao.addUser(userData);
    
    sendMailToAdmin(`Usuario: ${userData.username}\nNombre: ${userData.name}\nDirección: ${userData.address}\nEdad: ${userData.age}\nTeléfono: ${userData.phone}`, "Nuevo Registro");
    return({username: req.user.username, url_avatar: url_avatar, carrito: []});
}

exports.data = {
    "Puerto de Escucha": PORT,
    "Modo": mode,
    "Sistema Operativo": process.platform,
    "Version de Node": process.version,
    "Memoria Reservada": (((process.memoryUsage().rss)/(1024*1024)).toFixed(2)) + " MBytes",
    "Path de Ejecución": process.execPath,
    "ID del Proceso": process.pid,
    "Carpeta del Proyecto": process.cwd(),
    "Cantidad de Hilos Máximos Disponibles": maxCPUs,
}    

exports.config = {
    "Puerto de Escucha": PORT,
    "Url de base de datos": process.env.PERSISTENCE === "mongo" ? process.env.MONGO_URI : process.env.POSTGRE_URI,
    "E-mail del administrador": process.env.MAIL_ADMIN,
    "Tiempo de expiración de sesión (minutos)": process.env.SESSION_EXPIRATION_TIME,
}

exports.endPointDbActions = async (option, req, res) => {
    let resp;
    let data;

    switch (option) {
        case "uploadDB":
            data = req.body
            resp = await dao.uploadDB(data);
            return resp;
        case "getBDD":
            resp = await dao.getBDD();
            return resp;
        case "getProduct":
            data = req.body.id;
            resp = await dao.getProduct(data);
            return resp;
        case "addOrder":
            const orderData = req.body
            const order = await dao.addOrder(orderData);
            sendMailToAdmin(`Número de orden: ${order._id}\nFecha: ${order.date}\nNombre: ${order.name}\nE-mail: ${order.username}\nDirección: ${order.address}\nTeléfono: ${order.phone}\n\nProductos: ${order.products}\n\nTotal: $${order.total}`, "Nuevo Pedido");
            const orderIdForUser = order._id.toString().slice(-6);
            sendSMS(order.phone, `Recibimos tu pedido en E-Hard computación, el mismo se encuentra en proceso. El número de orden es ${orderIdForUser}`);
            //sendWhatSapp(process.env.PHONE_ADMIN, `Nuevo Pedido en E-Hard Computacion:\n\n Número de orden: ${order._id}\nFecha: ${order.date}\nNombre: ${order.name}\nE-mail: ${order.username}\nDirección: ${order.address}\nTeléfono: ${order.phone}\n\nProductos: ${order.products}\n\nTotal: $${order.total}`);
            return order;
        case "getUser":
            const username = req.body.username;
            const dataUser = await dao.getUser(username);
            return dataUser;
        case "saveCart":
            const carrito = req.body;
            const cartUsername = req.user.username;
            resp = await dao.saveCart(cartUsername, carrito)
            return resp;
        case "clearCarts":
            resp = await dao.clearCarts();
            return resp;
        case "modifyProduct":
            data = req.body;
            resp = await dao.modifyProduct(data);
            return resp;   
        case "deleteProduct":
            data = req.body.id;
            resp = await dao.deleteProduct(data);
            return resp;   
        case "addProduct":
            data = req.body;
            resp = await dao.addProduct(data);
            return resp;  
        default:
            return {message: "Opción inválida"};
    }
} 

