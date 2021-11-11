const fs = require('fs');
const { loggerError } = require('../../config/log4js');
const productsModel = require('../factoryProducts');

class FileSystem {

    #carritoId
    #urlPath

    constructor() {
        this.#urlPath = 'db/shoppingCarts.txt';
        this.#carritoId = ++this.read().length;
    }

    create(id_producto) {
        const producto = productsModel.readId(id_producto);
        let carritos = this.read();
        const newProductCart = {
            id: this.#carritoId++,
            timestamp: new Date().toLocaleString(),
            producto: producto
        };
        carritos.push(newProductCart);
        fs.writeFileSync(this.#urlPath, JSON.stringify(carritos, null, '\t'));
        return newProductCart;
    }

    read() {
        try {
            const carritos = fs.readFileSync(this.#urlPath, 'utf-8');
            return carritos ? JSON.parse(carritos) : [];
        } catch (error) {
            loggerError.error(`Error de persistencia al leer ${this.#urlPath}: ${error.message}`);
        }
    }

    readId(id) {
        const carritos = this.read();
        const carrito = carritos.filter(e => e.id == id);
        return carrito;
    }

    delete(id) {
        let carritos = this.read();
        const index = carritos.findIndex(carrito => carrito.id == id);
        if (index >= 0) {
            const carritoEliminado = carritos.splice(index, 1);
            fs.writeFileSync(this.#urlPath, JSON.stringify(carritos, null, '\t'));
            return carritoEliminado[0];
        } else {
            return false;
        }
    }

}

module.exports = FileSystem;