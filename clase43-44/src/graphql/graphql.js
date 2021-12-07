var { graphqlHTTP } = require('express-graphql');
const schema = require('./schemaGraphql');

const productController = require('../app/controllers/products');

// listar todos los productos
const getAllProducts = async () => {
    return await productController.list();
}

// listar un producto por id
const getProductById = async (args) => {
    const id = args.id;
    return await productController.listId(id);
}

// guardar producto
const saveProduct = async ({ title, price, thumbnail }) => {
    let product = { title, price, thumbnail };
    return await productController.save(product);
}

// actualizar producto
const updateProduct = async ({ id, title, price, thumbnail }) => {
    let data = { title, price, thumbnail };
    return await productController.update(id, data);
}

// eliminar producto
const deleteProduct = async ({ id }) => {
    return await productController.delete(id);
}

// Root resolver
const root = {
    products: getAllProducts,
    product: getProductById,
    saveProduct: saveProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct
};

module.exports = graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
})