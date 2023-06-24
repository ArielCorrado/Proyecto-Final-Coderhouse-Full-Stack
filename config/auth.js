const bcrypt = require("bcryptjs");
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const getDao = require("../dao/index");

passport.serializeUser((user, done) => {
    const sUser = {};
    sUser.username = user.username;
    sUser.isadmin = user.isadmin;
    done(null, sUser);                                      //sUser es un objeto del tipo: {"username":"ariel.corrado27@gmail.com","isadmin":true} que se guarda en la cookie en la key "passport.user" como identificación unica del usuario
});
  
passport.deserializeUser(async (userCookie, done) => {     //Acá "userCookie" toma el valor de la key "passport.user" de la cookie. Que puede ser un objeto como el siguiente: {"username":"ariel.corrado27@gmail.com","isadmin":true}
    const user = await getDao().getUser(userCookie.username);
    done(null, user);                                      //user se pasa a la siguiente función (función final del endpoint) como req.user al acceder a cualquier endpoint. 
});

passport.use("login", new LocalStrategy(async (username, password, done) => {         //Busca en el body del request las keys "username" y "password" y sus valores los guarda en los dos primeros parametros que pueden llamarse de cualquier manera
    const user = await getDao().getUser(username);                                    //la variable "user" se pasa como argumento a "serializeUser"
    if (user) {
        const isOk = bcrypt.compareSync(password, user.password);
        if (isOk) {
            done(null, user);
            return;
        }    
    }
    done(null, false);
}))

passport.use("signup", new LocalStrategy(async (username, password, done) => {    
    const userNameExists = await getDao().getUser(username);          
    if (!userNameExists) {
        const user = {username: username, isadmin: false};
        done(null, user);
    } else {
        const error = new Error("El nombre de usuario ya existe");                  //Este error se captura con el último middleware en app.js para enviar un json de respuesta
        error.status = 400; 
        done(error, false);
    }
}))