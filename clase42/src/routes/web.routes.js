const express = require('express');
const router = express.Router();

const { fork } = require('child_process');
const numCPUs = require('os').cpus().length;

const { loggerInfo, loggerError } = require('../config/log4js')

const middlewares = require('../app/middlewares/middlewares');
const obtenerRandom = require('../app/helpers/helpers');
const config = require('../config/config');


// endpoints
router.get('/', middlewares.checkAuthentication, (req, res) => {
    try {
        res.sendFile('index.html', { root: process.cwd() + '/src/public' });
    } catch (error) {
        loggerError.error(error);
    }
});

// ruta para obtener username desde el front
router.get('/getUser', middlewares.checkAuthentication, (req, res) => {
    try {
        res.json(req.session.userAuth)
    } catch (error) {
        loggerError.error(error);
    }
});

// get Info
router.get('/info', (req, res) => {
    try {
        const processInfo = {
            argv: process.argv,
            platform: process.platform,
            nodeVersion: process.version,
            memoryUse: process.memoryUsage(),
            execPath: process.execPath,
            processId: process.pid,
            currentDirectory: process.cwd(),
            numCPUs: numCPUs
        }
        res.json(processInfo)
    } catch (error) {
        loggerError.error(error);
    }
});

router.get('/info-debug', (req, res) => {
    try {
        const processInfo = {
            argv: process.argv,
            platform: process.platform,
            nodeVersion: process.version,
            memoryUse: process.memoryUsage(),
            execPath: process.execPath,
            processId: process.pid,
            currentDirectory: process.cwd(),
            numCPUs: numCPUs
        }
        console.log(processInfo);
        res.json(processInfo)
    } catch (error) {
        loggerError.error(error);
    }
});


router.get('/randoms', (req, res) => {
    try {
        const cant = req.query.cant ?? 100000000
        if (config.childProcess) {
            const random = fork(process.cwd() + '/src/childProcess/randoms');
            random.send(cant);
            random.on('message', obj => {
                loggerInfo.info(`Mensaje del hijo: ${cant} números generados.`);
                res.json(obj)
            })
        } else {
            let obj = {};
            for (let i = 0; i < cant; i++) {
                let numAleatorio = obtenerRandom(1, 1001);
                // obj[numAleatorio] = (obj[numAleatorio] || 0) + 1; 
                if (obj[numAleatorio] == undefined || obj[numAleatorio == null]) {
                    obj[numAleatorio] = 1;
                } else {
                    obj[numAleatorio] = obj[numAleatorio] + 1;
                }
            }
            res.json(obj)
        }
    } catch (error) {
        loggerError.error(error);
    }
});

module.exports = router;