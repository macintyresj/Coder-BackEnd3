const config = require('./config/config');

const express = require('express');
const app = express();

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const checkAuthentication = require('./app/middlewares/checkAuthentication');

const routerProducts = require('./routes/products.routes');
const routerShoppingCart = require('./routes/shoppingCarts.routes');
const routerOrders = require('./routes/orders.routes');
const routerAuth = require('./routes/auth.routes');
const { loggerInfo, loggerWarn, loggerError } = require('./config/log4js');


if (cluster.isMaster && config.MODO_CLUSTER) {
    loggerInfo.info('num CPUs', numCPUs)
    loggerInfo.info(`PID MASTER ${process.pid}`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork(); // creamos un worker para cada cpu
    }

    // controlamos la salida de los workers
    cluster.on('exit', worker => {
        loggerInfo.info('Worker', worker.process.pid, 'died');
        cluster.fork();
    });


} else {

    // Middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(session({
        store: MongoStore.create({
            mongoUrl: config.MONGO_DBaaS_URL,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }
        }),
        secret: 'secreto',
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 600000
        },
        rolling: true,
        resave: true,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());


    // Rutas
    app.get('/', (req, res) => {
        try {
            res.sendFile('index.html', { root: process.cwd() + '/src/public' });
        } catch (error) {
            loggerWarn.warn(error.message)
        }
    });

    app.get('/getUser', checkAuthentication, (req, res) => {
        try {
            res.json(req.user ?? { status: 'Usuario no logueado.'})
        } catch (error) {
            loggerWarn.warn(error.message);
        }
    });

    app.use('/productos', routerProducts);
    app.use('/carrito', checkAuthentication, routerShoppingCart);
    app.use('/orders', checkAuthentication, routerOrders);
    app.use('/auth', routerAuth);

    app.use(express.static(process.cwd() + '/src/public'));

    app.use((req, res, next) => {
        loggerWarn.warn(`Ruta ${req.originalUrl} método ${req.method} no implementada`)
        res.status(404).json({ error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada` });
        next();
    });

    const server = app.listen(config.PORT, () => {
        loggerInfo.info(`Servidor escuchando en http://localhost:${config.PORT}`);
        loggerInfo.info('Perfil admin:', config.admin);
        loggerInfo.info(`Tipo persistencia: ${config.TIPO_PERSISTENCIA}`);
    });

    server.on('error', error => {
        loggerError.error(`Error de servidor: ${error.message}`)
    });

}