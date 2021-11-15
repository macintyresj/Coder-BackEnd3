const mensaje = require('../models/message');
const { normalize } = require('normalizr');
const schemaMensajes = require('../models/messageNormalizr');
// const msgPrueba = require('./mensajesPrueba.json');

class MessagesController {

    constructor() {
        // this.save(msgPrueba)
    }

    async read() {
        const dataMongo = await mensaje.find({});
        let mensajes = dataMongo.map(msg => ({...msg._doc}));
        const mensajesNormalizados = normalize({id: "mensajes", mensajes: mensajes}, schemaMensajes);
        return mensajesNormalizados;
    };

    async save(message) {
        return mensaje.create(message);
    };

    async delete() {
        return await mensaje.deleteMany({});
    }

}

module.exports = new MessagesController();