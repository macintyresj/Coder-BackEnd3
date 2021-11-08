//Agrego la vista de productos 
const producto = require('../models/product');

class ProductsController {
    //Listar
    async list() {
        const products = await producto.find({});
        if (products.length > 0) {
            return products;
        } else {
            return [];
        }
    };
    //Listar por ID
    async listId(id) {
        return await producto.findById(id);
    }

    // Guardar
    async save(data) {
        if (data.title.trim().length < 1) {
            throw new Error("Debe ingresar el título.");
        } else if (isNaN(data.price)) {
            throw new Error("Ingrese un NÚMERO");
        } else if (data.price < 1) {
            throw new Error("Ingrese un número mayor a 0");
        } else {
            return await producto.create(data);
        }
    };

    //Actualizar
    async update(id, data) {
        if (data.title.trim().length < 1) {
            throw new Error("Debe ingresar el título.");
        } else if (isNaN(data.price)) {
            throw new Error("Ingrese un NÚMERO");
        } else if (data.price < 1) {
            throw new Error("Ingrese un número mayor a 0.");
        } else {
            return await producto.findOneAndUpdate({_id: id}, data);
        }
    };

    // Eliminar
    async delete(id) {
        return await producto.deleteOne({ _id: id });
    };

}

module.exports = new ProductsController();