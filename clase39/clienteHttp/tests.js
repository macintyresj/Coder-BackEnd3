const axios = require('axios')

const URL = 'http://localhost:8080'

async function createProduct() {
    try {
        let response = await axios.post(URL + '/api/products', { title: 'Prueba', price: 777, thumbnail: 'imagen' });
        return response.data;
    } catch (error) {
        console.error(error.response);
    }
};

async function getAllProducts() {
    try {
        let response = await axios.get(URL + '/api/products/json');
        return response.data;
    } catch (error) {
        console.error(error.response);
    }
};

async function getProductbyId() {
    try {
        const productsLists = await axios.get(URL + '/api/products/json');
        const idProduct = productsLists.data[productsLists.data.length - 1]._id;

        let response = await axios.get(URL + `/api/products/${idProduct}`);
        return response.data;
    } catch (error) {
        console.error(error.response);
    }
};

async function updateProduct() {
    try {
        const productsLists = await axios.get(URL + '/api/products/json');
        const idProduct = productsLists.data[productsLists.data.length - 1]._id;

        let response = await axios.put(URL + `/api/products/${idProduct}`, { title: 'Prueba actualizado', price: 777, thumbnail: 'imagen actualizado' });
        return response.data;
    } catch (error) {
        console.error(error.response);
    }
};

async function deleteProduct() {
    try {
        const productsLists = await axios.get(URL + '/api/products/json');
        const idProduct = productsLists.data[productsLists.data.length - 1]._id;

        let response = await axios.delete(URL + `/api/products/${idProduct}`);
        return response.data;
    } catch (error) {
        console.error(error.response);
    }
};

(async () => {
    console.log('CREATE PRODUCT->')
    console.log(await createProduct())

    console.log('GET ALL PRODUCTOS->')
    console.log(await getAllProducts())

    console.log('GET PRODUCT BY ID ->')
    console.log(await getProductbyId())

    console.log('UPTDATE PRODUCT ->')
    console.log(await updateProduct())

    console.log('DELETE PRODUCT ->')
    console.log(await deleteProduct())
})();