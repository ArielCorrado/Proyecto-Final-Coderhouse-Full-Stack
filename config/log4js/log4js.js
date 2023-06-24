const log4js = require("log4js");
const path = require("path");

log4js.configure({
    appenders: {
        console: {type: "console"},
        consoleLogger: {type: "logLevelFilter", appender: "console", level: "info"},

        warnFile: {type: "file", filename: path.resolve(__dirname + "/config/log4js/logs/warn.log")},
        warnFileLogger: {type: "logLevelFilter", appender: "warnFile", level: "warn", maxLevel: "warn"},

        errorFile: {type: "file", filename: path.resolve(__dirname + "/config/log4js/logs/error.log")},
        errorFileLogger: {type: "logLevelFilter", appender: "errorFile", level: "error"},
    },
    categories: {
        default: {appenders: ["consoleLogger", "warnFileLogger", "errorFileLogger"], level: "all"},
    }
})

const logger =  log4js.getLogger("default");

module.exports = {logger};