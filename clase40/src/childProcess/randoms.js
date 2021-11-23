const obtenerRandom = require('../app/helpers/helpers');
const { loggerInfo } = require('../config/log4js');

process.on('message', cant => {
    loggerInfo.info(`Mensaje del padre. Generar ${cant} números aleatorios - PID child process: ${process.pid}`);
    let obj = {};
    for (let i = 0; i < cant; i++) {
        let numAleatorio = obtenerRandom(1, 1001);
        if (obj[numAleatorio] == undefined || obj[numAleatorio == null]) {
            obj[numAleatorio] = 1;
        } else {
            obj[numAleatorio] = obj[numAleatorio] + 1;
        }
    }

    process.send(obj);
    process.exit();
});