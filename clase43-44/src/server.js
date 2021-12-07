// importo dependencias
const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const compression = require('compression');

const MongoDB = require('./database/connection'); // importo la conexión de la DB

//------------------------------MODULOS-----------------------------------
// configs
const config = require('./config/config');
const PORT = config.PORT;
const { loggerInfo, loggerError } = require('./config/log4js')

// middlewares
const middlewares = require('./app/middlewares/middlewares');

// rutas
const productsRouter = require('./routes/products.routes');
const authRouter = require('./routes/auth.routes');
const webRouter = require('./routes/web.routes');

// creo app tipo express
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);

//-----------------------------HANDLEBARS ---------------------------------------------------
app.engine("hbs", handlebars(config.templateEngine));
app.set("view engine", "hbs"); // esrablecemos motor de plantillas
app.set("views", `${__dirname}/views`); // directorio de archivos plantilla


//---------------------------- MIDDLEWARES -----------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(middlewares.configSession);
app.use(passport.initialize());
app.use(passport.session());
app.use(compression())


//--------------------------------- GRAPHQL --------------------------------------------------------------
const graphql = require('./graphql/graphql')
app.use('/graphql', graphql);


//----------------------------------- RUTAS ------------------------------------------------------------
app.use(webRouter);
app.use('/api/products', /*middlewares.checkAuthentication,*/ productsRouter);
app.use(authRouter);

app.use(express.static(__dirname + '/public')); // espacio público del servidor

app.use(middlewares.error404); // middleware 404


//-------------------------------------- SOCKETS -----------------------------------------------------------
const webSocket = require('./services/sockets');
const { logger } = require('./app/email/ethereal');
const onConnection = (socket) => {
    webSocket(io, socket);
}
io.on('connection', onConnection);



//---------------------------------------- SERVER MODE ------------------------------------------------------

if (config.MODO_CLUSTER && cluster.isMaster) {

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
    const server = http.listen(PORT, async () => {
        loggerInfo.info(`Servidor escuchando en http://localhost:${PORT} - PID: ${process.pid}`);
        loggerInfo.info(`NODE_ENV=${config.NODE_ENV} - GraphQL: ${config.GRAPHQL} - PERSISTENCIA=${config.PERSISTENCIA}`);
        const db = MongoDB.getMongoDBInstance(config.URL_MONGO_ATLAS);
        await db.connect();
    });

    server.on('error', err => {
        loggerError.error(`Error en el servidor: ${err}`);
    })
}