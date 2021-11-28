require('dotenv').config()

const config = {
    // Mongo Urls
    URL_MONGO_LOCAL: process.env.URL_MONGO_LOCAL,
    URL_MONGO_ATLAS: process.env.URL_MONGO_ATLAS,

    URL_MONGO_ATLAS_TEST: process.env.URL_MONGO_ATLAS_TEST,

    // config expiración sessión
    TIEMPO_EXPIRACION: 600000,

    // puerto express
    PORT: process.argv[2] || process.env.PORT,

    // activar child proces ruta randoms
    childProcess: false,

    // credenciales app facebook login
    FACEBOOK_CLIENT_ID: process.argv[3] || process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.argv[4] || process.env.FACEBOOK_CLIENT_SECRET,

    // credenciales Ethereal
    ETHEREAL_USER: process.env.ETHEREAL_USER,
    ETHEREAL_PASS: process.env.ETHEREAL_PASS,

    // credenciales Gmail
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASS: process.env.GMAIL_PASS,

    // destino emails aviso logueos
    MAIL_TO: process.env.MAIL_TO,

    // CREDENCIALES TWILIO
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_NUM_ORIGEN: process.env.TWILIO_NUM_ORIGEN,
    TWILIO_NUM_DESTINO: process.env.TWILIO_NUM_DESTINO,

    // template engine config
    templateEngine: {
        extname: ".hbs", // extensión a utilizar
        defaultLayout: "index.hbs", // plantilla principal
        layoutsDir: process.cwd() + "/src/views/layouts", // ruta a la plantilla principal
        partialsDir: process.cwd() + "/src/views/partials" // ruta a las plantillas parciales
    }
}

module.exports = config;