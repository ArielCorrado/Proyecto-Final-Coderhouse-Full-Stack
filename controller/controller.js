const {fork} = require("child_process");
const childProcess = fork("./childProcess.js");
const service = require("../service/service");
const validate = require("../validations/validate");

exports.login = (req, res) => {
    const {username, url_avatar, carrito, isadmin} = service.logData(req);                                   
    res.json({username: username, isLogged: true, url_avatar: url_avatar, carrito: carrito, isadmin: isadmin});
}   

exports.signup = async (req, res) => {
    const validationResult = validate.signup(req.body);
    if (validationResult.dataOk) {
        const {username, url_avatar, carrito} = await service.signup(req);    
        res.json({username: username, isLogged: true, url_avatar: url_avatar, carrito: carrito, isadmin: false});
    } else {
        res.status(400).end(validationResult.message);
    } 
}

exports.islogged = (req, res) => {
    if (req.user) {
        const {username, url_avatar, carrito, isadmin} = service.logData(req);
        res.json({ username: username, isLogged: true, url_avatar: url_avatar, carrito: carrito, isadmin: isadmin});
    } else {
        res.json({ username: null, isLogged: false, url_avatar: null, carrito: [], isadmin: false });
    }
}

exports.loguot = (req, res) => {
    if (req.user) {
        const {username, url_avatar, carrito, isadmin} = service.logData(req);
        req.session.destroy((err) => {
            err ? res.json({ username: username, isLogged: true, url_avatar: url_avatar, carrito: carrito, isadmin: isadmin}) : res.json({ username: null, isLogged: false, url_avatar: null, carrito: [], isadmin: false});
        });
    } else {
        res.status(400).end();
    }
}

exports.upload = (req, res) => {      //EndPoint para subir avatar
    res.json({ filename: req.filename });
}

exports.db = async (req, res) => {
    if (req.query.option === "getBDD" || ( req.user && !["modifyProduct", "deleteProduct", "addProduct"].includes(req.query.option)) || (req.user && req.user.isadmin === true))  {
        const validationResult = validate.dbActions(req.query.option, req.body);
        if (validationResult.dataOk) {
            const resp = await service.endPointDbActions(req.query.option, req, res);
            resp ? res.status(resp.message ? 400 : 200).json(resp) : res.status(400).json({success: false, message: "ID de producto no válido"});
        } else {
            res.status(400).end(validationResult.message);
        }
    } else {
        res.status(401).end("Acción no autorizada para el usuario actual");
    }    
}

exports.info = (req, res) => {           //Ruta con compresión
    const data = service.data;    
    res.render("vistaInfo.pug", {data});    
}

exports.config = (req, res) => {         
    const config = service.config;    
    res.render("config.handlebars", {config});   
}

exports.randoms = (req, res) => {
    childProcess.send(req.query.cant ?? 1e8);
    childProcess.on("message", (numeros) => {
        res.end(JSON.stringify(numeros, null, 2));
    })
}