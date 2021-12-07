const fs = require('fs');

class MessagesDTO {

    constructor(id, author, text, fyh) {
        this.id = id;
        this.author = author;
        this.text = text; 
        this.fyh = fyh;
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

module.exports = MessagesDTO;