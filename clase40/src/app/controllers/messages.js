const factoryPersistencia = require('../persistencia/factoryPersistencia');
const config = require('../../config/config');

class MessagesController {

    constructor() {
        this.persistencia = factoryPersistencia.getPersistencia('messages', config.PERSISTENCIA);
    }

    async list() {
        return await this.persistencia.read();
    };

    async save(message) {
        return await this.persistencia.create(message);
    };

    async update(id, data) {
        return await this.persistencia.update(id, data);
    }

    async delete(id) {
        return await this.persistencia.delete(id);
    }

    async deleteAll() {
        return await this.persistencia.deleteAll();
    }

}

module.exports = new MessagesController();