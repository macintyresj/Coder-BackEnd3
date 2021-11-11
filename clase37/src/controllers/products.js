let productsModel = require('../models/factoryProducts');

class Products {

    async list() {
        return await productsModel.read();
    }

    async listId(id) {
        return await productsModel.readId(id);
    }

    async save(product) {
        return await productsModel.create(product);
    }

    async update(id, data) {
        return await productsModel.update(id, data);
    }

    async delete(id) {
        return await productsModel.delete(id);
    }

    // metodo de filtrado
    async search(filters) {
        return await productsModel.search(filters);
    }

}

module.exports = new Products();