const session = require('express-session');

const MongoStore = require('connect-mongo')
const config = require('../../config/config');

const { logger, loggerWarn } = require('../../config/log4js');

// middleware de authentication
const checkAuthentication = (req, res, next) => {
    logger.trace(`Request tipo ${req.method} desde ${req.originalUrl}`)
    if (req.isAuthenticated()) {
        if (req.session.passport.user.provider == 'facebook') {
            req.session.userAuth = {
                username: req.user._json.name,
                email: req.user._json.email,
                foto: req.user._json.picture.data.url
            };
        } else {
            req.session.userAuth = {
                username: req.user.username
            };
        }
        next();
    } else {
        res.redirect("/login");
    }
}

// session
const configSession = session({
    store: MongoStore.create({
        mongoUrl: config.URL_MONGO_ATLAS,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }
    }),

    secret: 'secreto',
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: config.TIEMPO_EXPIRACION
    },
    rolling: true,
    resave: true,
    saveUninitialized: false
});

// error 404
const error404 = (req, res, next) => {
    loggerWarn.warn(`Ruta ${req.originalUrl} método ${req.method} no implementada o el archivo solicitado no existe`)
    res.status(404).json({ error: `Ruta ${req.originalUrl} método ${req.method} no implementada` });
    next();
}

// exporto los middlewares
module.exports = {
    checkAuthentication,
    configSession,
    error404
};