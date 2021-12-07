const fs = require('fs');

class ProductsDTO {

    constructor(id, title, price, thumbnail, timestamp) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
        this.timestamp = timestamp;
    }

    getId() {
        return this.id;
    }

    getTitle() {
        return this.title;
    }

    getPrice() {
        return this.price;
    }

    getThumbnail() {
        return this.thumbnail;
    }

    getTimestamp() {
        return this.timestamp;
    }

}

module.exports = ProductsDTO;