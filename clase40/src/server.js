// importo dependencias
const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const compression = require('compression');

const MongoDB = require('./database/connection'); // importo la conexión de la DB

// modulos configuraciones
const config = require('./config/config');
const PORT = config.PORT;
const { loggerInfo, loggerError } = require('./config/log4js')

// modulos middlewares
const middlewares = require('./app/middlewares/middlewares');

// importo el modulo de rutas
const productsRouter = require('./routes/products.routes');
const authRouter = require('./routes/auth.routes');
const webRouter = require('./routes/web.routes');

// creo app tipo express
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);

//-------------------------------- MOTOR DE PLANTILLAS------------------------------------------------------
app.engine("hbs", handlebars(config.templateEngine));
app.set("view engine", "hbs"); // esrablecemos motor de plantillas
app.set("views", `${__dirname}/views`); // directorio de archivos plantilla


//-------------------------------- MIDDLEWARES -------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(middlewares.configSession);
app.use(passport.initialize());
app.use(passport.session());
app.use(compression())


//--------------------------------------GRAPHQL -----------------------------------------------------------------
var { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schemaGraphql');
const root = require('./graphql/graphql');
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


//------------------------------------- RUTAS ----------------------------------------------------------------------
app.use(webRouter);
app.use('/api/products', /*middlewares.checkAuthentication,*/ productsRouter);
app.use(authRouter);

app.use(express.static(__dirname + '/public')); // espacio público del servidor

app.use(middlewares.error404); // middleware 404


//------------------------------------- SOCKETS --------------------------------------------------------------------
const webSocket = require('./services/sockets');
const onConnection = (socket) => {
    webSocket(io, socket);
}
io.on('connection', onConnection);


const PersistenciaFactory = require('./app/persistencia/factoryPersistencia');
loggerInfo.info(`Tipo Persistencia: ${config.PERSISTENCIA}`)

// PATRON SINGLETON
const instancia1 = PersistenciaFactory.getPersistencia('products', config.PERSISTENCIA);
const instancia2 = PersistenciaFactory.getPersistencia('products', config.PERSISTENCIA);
const instancia3 = PersistenciaFactory.getPersistencia('products', config.PERSISTENCIA);
const instancia4 = PersistenciaFactory.getPersistencia('messages', config.PERSISTENCIA);
const instancia5 = PersistenciaFactory.getPersistencia('messages', config.PERSISTENCIA);
const instancia6 = PersistenciaFactory.getPersistencia('messages', config.PERSISTENCIA);

instancia1.printValue();
instancia2.printValue();
instancia3.printValue();
instancia4.printValue();
instancia5.printValue();
instancia6.printValue();


//-------------------------------- SERVER MODE -----------------------------------------------------------------
let modoCluster = process.argv[5] === "FORK";

if (modoCluster && cluster.isMaster) {

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
        loggerInfo.info(`Servidor escuchando en http://localhost:${PORT} - Proceso Node.js: ${process.pid}`);
        const db = MongoDB.getMongoDBInstance(config.URL_MONGO_ATLAS);
        await db.connect();
    });

    server.on('error', err => {
        loggerError.error(`Error en el servidor: ${err}`);
    })
}