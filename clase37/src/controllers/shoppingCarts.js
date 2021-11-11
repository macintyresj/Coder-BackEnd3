const shoppingCartsModel = require('../models/factoryShoppingCarts');

class Carrito {

    async list(id_cliente) {
        return await shoppingCartsModel.read(id_cliente);
    }

    async listId(id) {
        return await shoppingCartsModel.readId(id);
    }

    async save(id_producto, id_cliente) {
        return await shoppingCartsModel.create(id_producto, id_cliente);
    }

    async delete(id) {
        return await shoppingCartsModel.delete(id);
    }

}

module.exports = new Carrito();