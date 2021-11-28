const fs = require('fs');

class fileSystemDTO {

    constructor(title, price, thumbnail) {
        this.id = this.generarId();
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
        this.timestamp = new Date().toLocaleString()
    }

    generarId() {
        try {
            let data = fs.readFileSync('src/dbFile/productsId.txt', 'utf-8');
            let dataParse = JSON.parse(data);
            dataParse[0].id++ 
            fs.writeFileSync('src/dbFile/productsId.txt', JSON.stringify(dataParse, null, '\t'));
            return dataParse[0].id;
        } catch (error) {
            console.log(error);
        }
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

module.exports = fileSystemDTO;