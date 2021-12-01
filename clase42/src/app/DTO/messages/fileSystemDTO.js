const fs = require('fs');

class fileSystemDTO {

    constructor(author, text) {
        this.id = this.generarId();
        this.author = author;
        this.text = text;
        this.fyh = new Date().toLocaleString()
    }

    generarId() {
        try {
            let data = fs.readFileSync('src/dbFile/messagesId.txt', 'utf-8');
            let dataParse = JSON.parse(data);
            dataParse[0].id++ 
            fs.writeFileSync('src/dbFile/messagesId.txt', JSON.stringify(dataParse, null, '\t'));
            return dataParse[0].id;
        } catch (error) {
            console.log(error);
        }
    }

    getId() {
        return this.id;
    }

    getAuthor() {
        return this.author;
    }

    getText() {
        return this.text;
    }

    getFyh() {
        return this.fyh;
    }

}

module.exports = fileSystemDTO;