const daoFactory = require('../DAO/DAOFactory.js');
const config = require('../../config/config');

class ProductsController {

    constructor() {
        this.productDao = daoFactory.getPersistencia('products', config.PERSISTENCIA);
    }

    async list() {
        return await this.productDao.read();
    };

    async listId(id) {
        return await this.productDao.readId(id);
    }

    async save(data) {
        return await this.productDao.create(data);
    };

    async update(id, data) {
        return await this.productDao.update(id, data);
    };

    async delete(id) {
        return await this.productDao.delete(id);
    };

}

module.exports = new ProductsController();