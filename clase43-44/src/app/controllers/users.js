const User = require('../models/user');
const { isValidPassword, createHash } = require('../helpers/helpers');
const { loggerInfo, loggerWarn, loggerError } = require('../../config/log4js');

class UsersController {

    constructor() {

    }

    login(username, password, done) {
        User.findOne({ username: username },
            (err, user) => {
                // ocurrio un error
                if (err) {
                    loggerError.error('Error de login' + err);
                    return done(err);
                }

                // usuario no exite
                if (!user) {
                    return done(null, false, loggerWarn.warn('Usuario no existe!'));
                }

                // usuario existe pero esta mal la contraseña
                if (!isValidPassword(user, password)) {
                    return done(null, false, loggerWarn.warn('Password incorrecto!'));
                }

                // credenciales correctas
                return done(null, user);

            })
    }

    signup(username, password, done) {
        User.findOne({ username: username },
            (err, user) => {
                // en caso de error
                if (err) {
                    loggerError.error('Error de signup' + err);
                    return done(err);
                }

                // usuari0 existe
                if (user) {
                    return done(null, false, loggerWarn.warn('Usuario ya existe'));
                } else {
                    // creamos el susuario
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

}

module.exports = new UsersController();