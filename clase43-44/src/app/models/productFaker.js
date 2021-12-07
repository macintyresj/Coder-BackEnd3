const faker = require('faker');

faker.locale = 'es';

class ProductModelFaker {

    generarProducto() {
        return {
            id: faker.datatype.uuid(),
            title: faker.commerce.productName(),
            price: Number(faker.commerce.price()),
            thumbnail: faker.image.image(),
            timestamp: faker.datatype.datetime()
        }
    }

}

module.exports = new ProductModelFaker();