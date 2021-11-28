const IDao = require('../IDao');
const fs = require('fs');
const ProductDTO = require('../../DTO/products/fileSystemDTO');

let instaciaFileSystem = null;

class FileSystemDao extends IDao {

    constructor() {
        super(); 
        
        this.urlPath = 'src/dbFile/products.txt';
    }

    static getInstance() {
        if (!instaciaFileSystem) {
            instaciaFileSystem = new FileSystemDao();
        }

        return instaciaFileSystem;
    } 

    create(product) {
        try {
            let products = this.read();
            const newProduct = new ProductDTO(product.title, product.price, product.thumbnail)
            products.push(newProduct);
            fs.writeFileSync(this.urlPath, JSON.stringify(products, null, '\t'));
            return products[products.length - 1];
        } catch (error) {
            console.log(`Error de persistencia al guardar ${this.urlPath}: ${error.message}`);
        }
    }

    read() {
        try {
            const products = fs.readFileSync(this.urlPath, 'utf-8');
            return products ? JSON.parse(products) : [];
        } catch (error) {
            console.log(`Error de persistencia al leer ${this.urlPath}: ${error.message}`);
        }
    }

    readId(id) {
        const products = this.read();
        const product = products.filter(e => e.id == id);
        return product[0];
    }

    update(id, data) {
        let products = this.read();
        let product = products.filter(p => p.id == id);
        if (product.length) {
            let productUpdated = Object.assign(product[0], data);
            productUpdated.timestamp = new Date().toLocaleString();
            fs.writeFileSync(this.urlPath, JSON.stringify(products, null, '\t'));
            return productUpdated;
        } else {
            return false;
        }
    }

    delete(id) {
        let products = this.read();
        let index = products.findIndex(p => p.id == id);
        if (index >= 0) {
            const productDeleted = products.splice(index, 1);
            fs.writeFileSync(this.urlPath, JSON.stringify(products, null, '\t'));
            return productDeleted;
        } else {
            return false;
        }
    }

}

module.exports = FileSystemDao;