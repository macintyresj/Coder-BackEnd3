require('dotenv').config();
const nombresPersistencias = {
    1: "fileSystem",
    // 2: "mySql",
    3: "MongoDB",
    4: "MongoDB_DBaaS"
}

module.exports = {
    /* configurar aquí el numero de persistencia
    *   1: "fileSystem",
    *   2: "mySql",
    *   3: "MongoDB",
    *   4: "MongoDB_DBaaS"
    */
    TIPO_PERSISTENCIA: nombresPersistencias[4], 

    MODO_CLUSTER: false,

    // urls mongoDB
    MONGO_URL: process.env.URL_MONGO_LOCAL,
    MONGO_DBaaS_URL: process.env.URL_MONGO_ATLAS,

    // credenciales Gmail
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASS: process.env.GMAIL_PASS,

    // credenciales Twillio
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_NUM_SMS: process.env.TWILIO_NUM_SMS,
    TWILIO_NUM_WHATSAPP: process.env.TWILIO_NUM_WHATSAPP,

    // puerto servidor express
    PORT: process.env.PORT || 8080,

    // configuración de permisos administrador (true o false)
    admin: true,

    // mail admin
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_WHATSAPP: process.env.ADMIN_WHATSAPP
}