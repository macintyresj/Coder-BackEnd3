const { buildSchema } = require('graphql');

// schema
const schema = buildSchema(`
    type Query {
        products: [Product],
        product(id: String!): Product
    },
    type Mutation {
        saveProduct(title: String!, price: Float!, thumbnail: String): Product
    },
    type Product {
        id: String
        title: String
        price: Float
        thumbnail: String
    }  
`);

module.exports = schema;