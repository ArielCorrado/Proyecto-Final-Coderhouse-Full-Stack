const path = require("path");
const {logger} = require("./log4js/log4js");

const routesControl = (app) => {
    
    app.get(["/login*", "/signup*", "/cart*", "/item*", "/category*", "/search*", "/admin*"], (req,res) => {  //Rutas administradas por React
        res.sendFile(path.resolve(__dirname,"../public/build/index.html"));
    })    

    app.all("*", (req, res) => {
        logger.warn(`Ruta: "${req.url}" - Método: ${req.method} - No Implementados`);
        res.status(404).render("vistaError.ejs", {data: {route: req.url, method: req.method}});
    })

}

module.exports = routesControl;