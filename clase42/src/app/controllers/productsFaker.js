const productModelFaker = require('../models/productFaker');

class ProductsControllerFaker {

    constructor() {

    }
    
    generar(cant = 10) {
        let productsFaker = [];
        for (let i = 0; i < cant; i++) {
            productsFaker.push(productModelFaker.generarProducto());
        }
    
        return productsFaker;
    }

}

module.exports = new ProductsControllerFaker();