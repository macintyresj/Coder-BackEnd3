// ----------------------------------- PASSPORT--------------------------------------------------------------
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const userController = require('../controllers/users');
const config = require('../../config/config');
const { loggerInfo, loggerWarn, loggerError } = require('../../config/log4js');

// Agrego email
const transporterEt = require('../email/ethereal');
const transporterGm = require('../email/gmail');

// Credenciales Facebook App
const FACEBOOK_CLIENT_ID = config.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = config.FACEBOOK_CLIENT_SECRET;

// LocalStrategy de "login"
passport.use('login', new LocalStrategy({
    passReqToCallback: true
},
    (req, username, password, done) => {
        // chequeamos si el usuario existe en mongo
        userController.login(username, password, done)
    }
))

// LocalStrategy de "signup"
passport.use('signup', new LocalStrategy({
    passReqToCallback: true
},
    (req, username, password, done) => {
        
        findOrCreateUser = () => {
            // buscar en mongo el username
            userController.signup(username, password, done)
        }

        process.nextTick(findOrCreateUser);

    }
))

// FacebookStrategy de "login"
passport.use('facebook', new FacebookStrategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'emails'],
    scope: ['email']
}, (accessToken, refreshToken, profile, done) => {

    //envio aviso logueo con Ethereal
    transporterEt.sendMail({
        from: 'App Node-express CoderHouse',
        to: config.MAIL_TO,
        subject: `Login Facebook - ${profile._json.name}`,
        html: `<p>Usuario: ${profile._json.name}</p><p>Fecha y hora: ${new Date().toLocaleString()}</p>`
    }, (err, info) => {
        if (err) {
            loggerError.error(err)
            return err
        }
        loggerInfo.info(info);
    });

    //envio aviso logueo con Gmail
    transporterGm.sendMail({
        from: 'App Node-express CoderHouse',
        to: config.MAIL_TO,
        subject: `Login Facebook - ${profile._json.name}`,
        html: `<p>Usuario: ${profile._json.name}</p><p>Fecha y hora: ${new Date().toLocaleString()}</p><img src=${profile._json.picture.data.url} />`
    }, (err, info) => {
        if (err) {
            loggerError.error(err)
            return err
        }
        loggerInfo.info(info);
    });

    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;