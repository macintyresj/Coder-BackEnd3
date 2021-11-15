// ------------------------------PASSPORT-----------------------------------------------------
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
const config = require('../../config/config');
const { loggerInfo, loggerWarn, loggerError } = require('../../config/log4js');

// agrego Email
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
        User.findOne({ username: username },
            (err, user) => {
                // en caso de error
                if (err) {
                    loggerError.error('Error de login' + err);
                    return done(err);
                }

                // si usuario no exite
                if (!user) {
                    return done(null, false, loggerWarn.warn('Usuario no existe!'));
                }

                // usuario existe pero contraseña erronea
                if (!isValidPassword(user, password)) {
                    return done(null, false, loggerWarn.warn('contraseña incorrecta!'));
                }

                // si todo OK
                return done(null, user);

            })
    }
))

// validar password
const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

// LocalStrategy de "signup"
passport.use('signup', new LocalStrategy({
    passReqToCallback: true
},
    (req, username, password, done) => {
        findOrCreateUser = () => {
            // buscar en mongo el username
            User.findOne({ username: username },
                (err, user) => {
                    // en caso de error
                    if (err) {
                        loggerError.error('Error de signup' + err);
                        return done(err);
                    }

                    // usuario existe
                    if (user) {
                        return done(null, false, loggerWarn.warn('Usuario ya existe'));
                    } else {
                        // no existe => creamos el susuario
                        var newUser = new User();

                        newUser.username = username;
                        newUser.password = createHash(password);

                        newUser.save((err) => {
                            if (err) {
                                loggerWarn.warn(`Error al guardar el usuario ${err}`)
                                throw err;
                            }
                            loggerInfo.info('Usuario registrado correctamente');
                            return done(null, newUser)
                        })

                    }
                })
        }

        process.nextTick(findOrCreateUser);

    }
))

// hashear pass
const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

// FacebookStrategy de "login"
passport.use('facebook', new FacebookStrategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'emails'],
    scope: ['email']
}, (accessToken, refreshToken, profile, done) => {

    //Aviso Log con Ethereal
    transporterEt.sendMail({
        from: 'App CoderHouse',
        to: config.MAIL_TO,
        subject: `Login - ${profile._json.name}`,
        html: `<p>Usuario: ${profile._json.name}</p><p>Fecha y hora: ${new Date().toLocaleString()}</p>`
    }, (err, info) => {
        if (err) {
            loggerError.error(err)
            return err
        }
        loggerInfo.info(info);
    });

    //aviso log con Gmail
    transporterGm.sendMail({
        from: 'App CoderHouse',
        to: config.MAIL_TO,
        subject: `Login  - ${profile._json.name}`,
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

