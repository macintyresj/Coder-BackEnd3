const log4js = require("log4js");

log4js.configure({
    //apéndices
    appenders: {
        loggerConsole: { type: 'console' },
        loggerWarnFile: { type: 'file', filename: process.cwd()+'/src/logs/warn.log' },
        loggerErrorFile: { type: 'file', filename: process.cwd()+'/src/logs/error.log' }
    },
    // categorías
    categories: {
        default: { appenders: ['loggerConsole'], level: 'trace' },
        info: { appenders: ['loggerConsole'], level: 'info' },
        warn: { appenders: ['loggerConsole', 'loggerWarnFile'], level: 'warn' },
        error: { appenders: ['loggerConsole', 'loggerErrorFile'], level: 'error' }
    }
});

//Niveles de salida
const logger = log4js.getLogger(),
    loggerInfo = log4js.getLogger('info'),
    loggerWarn = log4js.getLogger('warn'),
    loggerError = log4js.getLogger('error');

module.exports = {
    logger,
    loggerInfo,
    loggerWarn,
    loggerError
};