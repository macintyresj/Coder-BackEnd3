const { Router } = require('express');
const router = Router();
const shoppingCartController = require('../app/controllers/shoppingCarts');
const config = require('../config/config');
const { loggerInfo, loggerError, loggerWarn } = require('../config/log4js');
const transporterGm = require('../app/email/gmail');

// TWILIO
const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

router.post('/new-order', async (req, res) => {
    try {
        const itemsCarrito = await shoppingCartController.list(req.user.id);
        const template = itemsCarrito.map((item) => `<p>${item.producto.codigo} - ${item.producto.nombre}</p>`).join('');

        if (itemsCarrito.length) {
            // envio de email al admin
            transporterGm.sendMail({
                from: config.GMAIL_USER,
                to: config.ADMIN_EMAIL,
                subject: `Nuevo Pedido de ${req.user.nombre} - ${req.user.email}`,
                html: `<div><h4>Productos:</h4>${template}</div>`
            }, (err, info) => {
                if (err) {
                    loggerWarn.warn(err.message)
                    return err
                }
                loggerInfo.info(info);
            });

            // mensaje de WhatsApp al admin
            client.messages.create({
                body: `Nuevo Pedido de ${req.user.nombre} - ${req.user.email}`,
                from: `whatsapp:${config.TWILIO_NUM_WHATSAPP}`,
                to: `whatsapp:${config.ADMIN_WHATSAPP}`
            })
                .then(message => loggerInfo.info(`WhatsApp_id: ${message.sid} - Enviado a: ${message.to}`))
                .catch(err => loggerWarn.warn(err.message))


            // mensaje de texto al cliente
            client.messages.create({
                body: 'Su pedido ha sido recibido y se encuentra en proceso.',
                from: config.TWILIO_NUM_SMS,
                to: req.user.telefono
            })
                .then(message => loggerInfo.info(`SMS_id: ${message.sid} - Enviado a: ${message.to}`))
                .catch(err => loggerWarn.warn(err.message))

            res.json({ status: "ok", descripcion: 'Pedido generado con éxito.' });
        } else {
            res.json({ error: 'Carrito vacio' })
        }

    } catch (error) {
        loggerError.error(error.message);
    }

});

module.exports = router;