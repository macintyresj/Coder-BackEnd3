const request = require('supertest')('http://localhost:8080');
const expect = require('chai').expect
const productFakerController = require('../app/controllers/productsFaker');


describe('Test API - CRUD Products', () => {

    // listar todos los productos
    describe('GET', () => {
        it('should return status 200 and the product array', async () => {
            let response = await request.get('/api/products/json')
            expect(response.status).to.eql(200);
            expect(response.body).to.be.an('array');
        });
    });

    // agregar producto
    describe('POST', () => {
        it('should add a random product and show it', async () => {
            let newProduct = productFakerController.generar(3);

            let response = await request.post('/api/products').send(newProduct[0])
            expect(response.status).to.eql(200)

            const productResponse = response.body
            expect(productResponse).to.include.keys('title', 'price', 'thumbnail')
            expect(productResponse.title).to.eql(newProduct[0].title)
            expect(productResponse.price).to.eql(newProduct[0].price)
            expect(productResponse.thumbnail).to.eql(newProduct[0].thumbnail)
        })
    });

    // listar producto por id
    describe('GET', () => {
        it('should return the product that matches with the id sent', async () => {
            let data = await request.get('/api/products/json')
            let idProduct = data.body[data.body.length-1]._id;

            let response = await request.get(`/api/products/${idProduct}`)

            expect(response.status).to.eql(200);
            const productResponse = response.body
            expect(productResponse._id).to.eql(idProduct)
            expect(productResponse).to.include.keys('title', 'price', 'thumbnail')
        });
    });

    // actualizar producto
    describe('PUT', () => {
        it('should update and return the product', async () => {
            let data = await request.get('/api/products/json')
            let idProduct = data.body[data.body.length-1]._id;
            let productUpdated = productFakerController.generar(1);

            let response = await request.put(`/api/products/${idProduct}`).send(productUpdated[0])
            expect(response.status).to.eql(200)

            const productResponse = response.body
            expect(productResponse).to.include.keys('_id', 'title','price', 'thumbnail')
            expect(productResponse._id).to.eql(idProduct)
            expect(productResponse.title).to.eql(productUpdated[0].title)
            expect(productResponse.price).to.eql(productUpdated[0].price)
            expect(productResponse.thumbnail).to.eql(productUpdated[0].thumbnail)
        })
    });

    // eliminar producto
    describe('DELETE', () => {
        it('should delete the product which matches with the selected id', async () => {
            let data = await request.get('/api/products/json')
            let idProduct = data.body[data.body.length-1]._id;

            let response = await request.delete(`/api/products/${idProduct}`);
            expect(response.status).to.eql(200);

            const productResponse = response.body

            expect(productResponse.n).to.eql(1)
            expect(productResponse.ok).to.eql(1)
            expect(productResponse.deletedCount).to.eql(1)
        });
    });


});
