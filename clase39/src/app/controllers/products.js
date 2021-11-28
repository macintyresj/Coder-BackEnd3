const producto = require('../models/product');

class ProductsController {

    async list() {
        const products = await producto.find({});
        if (products.length > 0) {
            return products;
        } else {
            return [];
        }
    };

    async listId(id) {
        return await producto.findById(id);
    }

    // metodo para guardar un producto
    async save(data) {
        if (data.title.trim().length < 1) {
            throw new Error("Campo title requerido.");
        } else if (isNaN(data.price)) {
            throw new Error("El campo precio debe ser un número");
        } else if (data.price < 1) {
            throw new Error("El campo precio debe ser mayor o igual a 1.");
        } else {
            return await producto.create(data);
        }
    };

    // metodo para actualizar un producto
    async update(id, data) {
        if (data.title.trim().length < 1) {
            throw new Error("Campo title requerido.");
        } else if (isNaN(data.price)) {
            throw new Error("El campo precio debe ser un número");
        } else if (data.price < 1) {
            throw new Error("El campo precio debe ser mayor o igual a 1.");
        } else {
            return await producto.findOneAndUpdate({_id: id}, data, { new: true });
        }
    };

    // metodo para eliminar un producto
    async delete(id) {
        return await producto.deleteOne({ _id: id });
    };

}

module.exports = new ProductsController();