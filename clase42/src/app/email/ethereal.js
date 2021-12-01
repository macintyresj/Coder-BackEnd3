const nodemailer = require('nodemailer');
const config = require('../../config/config');

const transporterEthereal = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: config.ETHEREAL_USER,
        pass: config.ETHEREAL_PASS
    }
});

module.exports = transporterEthereal;