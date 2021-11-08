const { loggerWarn } = require("../../config/log4js");

// middleware de authentication
const checkAuthentication = (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.json({ error: `No está autenticado.` })

        }
    } catch (error) {
        loggerWarn.warn(error);
    }
}

module.exports = checkAuthentication;