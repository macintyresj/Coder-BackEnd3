// controladores
const products = require('../app/controllers/products');
const messages = require('../app/controllers/messages');
// logger
const { loggerInfo, loggerError } = require('../config/log4js');

const config = require('../config/config');
// TWILIO
const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

module.exports = (io, socket) => {
    loggerInfo.info('ws: Nuevo cliente conectado');

    try {

        (async () => {
            const productsList = await products.list();
            socket.emit('products', { products: productsList, hayProductos: productsList.length > 0 });
        })();

        (async () => {
            socket.emit('messages', await messages.list());
        })();

        socket.on('newProduct', async (data) => {
            const productsList = await products.list();
            io.sockets.emit('products', { products: productsList, hayProductos: productsList.length > 0 });
            loggerInfo.info(`ws: ${data}`);
        });

        socket.on('newMessage', async (message) => {
            await messages.save(message);
            if (message.text.toLowerCase() == 'administrador') {
                client.messages.create({
                    body: `Author: ${message.author.email} - Mensaje: ${message.text}`,
                    from: config.TWILIO_NUM_ORIGEN,
                    to: config.TWILIO_NUM_DESTINO
                })
                    .then(message => loggerInfo.info(message.sid))
                    .catch(err => loggerError.error(err))
            }
            io.sockets.emit('messages', await messages.list());
        });

        socket.on('deleteProduct', async (data) => {
            const productsList = await products.list();
            io.sockets.emit('products', { products: productsList, hayProductos: productsList.length > 0 });
            loggerInfo.info(`ws: ${data}`);
        });

        socket.on('deleteMessages', async (data) => {
            await messages.deleteAll();
            io.sockets.emit('messages', await messages.list());
            loggerInfo.info(`ws: ${data}`);
        });

    } catch (error) {
        socket.emit('error', { error: error.message })
    }

}