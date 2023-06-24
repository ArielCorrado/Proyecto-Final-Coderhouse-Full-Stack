const argv = require("minimist")(process.argv.slice(2));
const path = require("path");
require('dotenv').config({path: path.resolve(__dirname, "../.env")});           //Especificamos la ruta del archivo .env De lo contrario los archivos de Test no reconocen el puerto

const mode = argv.mode || "FORK";                                               //Ejemplo para iniciar app: "node server.js --port=8085 --mode=CLUSTER"

const PORT = process.env.PORT || argv.port || process.env.PORT_LOCAL;

const PORTFILES = process.execPath.includes("elastic") ?  "" : ":" + PORT;

module.exports = {mode, PORT, PORTFILES};