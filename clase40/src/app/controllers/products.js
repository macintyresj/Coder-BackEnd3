const factoryPersistencia = require('../persistencia/factoryPersistencia');
const config = require('../../config/config');

class ProductsController {

    constructor() {
        this.persistencia = factoryPersistencia.getPersistencia('products', config.PERSISTENCIA);
    }

    async list() {
        return await this.persistencia.read();
    };

    async listId(id) {
        return await this.persistencia.readId(id);
    }

    async save(data) {
        return await this.persistencia.create(data);
    };

    async update(id, data) {
        return await this.persistencia.update(id, data);
    };

    async delete(id) {
        return await this.persistencia.delete(id);
    };

}

module.exports = new ProductsController();