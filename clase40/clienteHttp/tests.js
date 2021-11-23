const axios = require('axios')

const URL = 'http://localhost:8080'

async function createProduct() {
    try {
        let response = await axios.post(URL + '/api/products', { title: 'test1', price: 4000, thumbnail: 'imagen' });
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

        let response = await axios.put(URL + `/api/products/${idProduct}`, { title: 'test update', price: 4000, thumbnail: 'updateimagen' });
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
    console.log('Create Product -> ')
    console.log(await createProduct())
    console.log('Get all Products -> ')
    console.log(await getAllProducts())
    console.log('Get product by ID ->')
    console.log(await getProductbyId())
    console.log('Update product ->')
    console.log(await updateProduct())
    console.log('Delete Product ->')
    console.log(await deleteProduct())
})();